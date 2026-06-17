import json
import base64
import io
import os
import logging
from pathlib import Path

import numpy as np
import onnxruntime as ort
import torch
from PIL import Image
import albumentations as A
from albumentations.pytorch import ToTensorV2
from groq import Groq

logger = logging.getLogger(__name__)

# ── Paths ──────────────────────────────────────────────────────────────────
BASE_DIR    = Path(__file__).resolve().parent / "models"
CONFIG_PATH = BASE_DIR / "EfficientUNet_config.json"
MODEL_PATH  = BASE_DIR / "EfficientUNet.onnx"

# ── Load config ────────────────────────────────────────────────────────────
with open(CONFIG_PATH) as f:
    _cfg = json.load(f)

INPUT_SIZE = _cfg["input_size"]
MEAN       = _cfg["normalization"]["mean"]
STD        = _cfg["normalization"]["std"]
THRESHOLD  = _cfg["threshold"]

# ── Load ONNX session once at startup ─────────────────────────────────────
_session     = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])
_input_name  = _session.get_inputs()[0].name
_output_name = _session.get_outputs()[0].name

# ── Groq client once at startup ───────────────────────────────────────────
_groq_client = Groq(api_key=os.environ["GROQ_API_KEY"])

MAX_FILE_SIZE_MB = 15


# ── Validation ─────────────────────────────────────────────────────────────
def _is_colonoscopy_image(image_pil: Image.Image) -> tuple[bool, str]:
    """
    Uses Groq vision to verify the image is a real endoscopy frame.
    Returns (True, "") if valid, (False, reason) if not.
    """

    # Quick cheap checks first
    w, h = image_pil.size
    if w < 100 or h < 100:
        return False, "Image resolution is too low to be an endoscopy frame."

    ratio = w / h
    if ratio < 0.3 or ratio > 3.5:
        return False, "Image aspect ratio is unusual for an endoscopy frame."

    mean_brightness = np.array(image_pil.convert("RGB"), dtype=np.float32).mean()
    if mean_brightness < 8:
        return False, "Image is too dark to be a valid endoscopy image."
    if mean_brightness > 248:
        return False, "Image appears blank or overexposed."

    # Convert image to base64 for Groq vision
    buf = io.BytesIO()
    image_pil.save(buf, format="PNG")
    image_b64 = base64.b64encode(buf.getvalue()).decode()

    # Ask Groq vision model
    try:
        response = _groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            max_tokens=10,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",          # ✅ type field present
                            "image_url": {
                                "url": f"data:image/png;base64,{image_b64}"
                            },
                        },
                        {
                            "type": "text",           
                            "text": (
                                "Is this image a medical endoscopy image taken inside the human body (any type: "
                                "colonoscopy, small intestine, gastroscopy, capsule endoscopy, etc)? "
                                "Reply with ONLY the word YES or NO. "
                                "YES = any real internal medical endoscopy image. "
                                "NO = anything else (cartoon, regular photo, screenshot, diagram, X-ray, MRI, etc)."
                            ),
                        },
                    ],
                }
            ],
        )

        answer = response.choices[0].message.content.strip().upper()
        logger.info(f"Groq vision answer: {answer}")

        if "YES" in answer:
            return True, ""
        else:
            return False, (
                "This image does not appear to be a medical endoscopy image. "
                "Please upload a real endoscopy image for analysis."
            )

    except Exception as e:
        logger.error(f"Groq vision check failed: {e}")
        return False, (
            f"Image validation service is temporarily unavailable. Please try again. (Error: {e})"
        )


def _validate_file(image_field) -> str | None:
    """Returns error string or None."""
    try:
        image_field.seek(0, 2)
        size_mb = image_field.tell() / (1024 * 1024)
        image_field.seek(0)
        if size_mb > MAX_FILE_SIZE_MB:
            return f"File too large ({size_mb:.1f} MB). Maximum is {MAX_FILE_SIZE_MB} MB."
    except Exception:
        pass
    return None


# ── Preprocessing / postprocessing ────────────────────────────────────────
def _preprocess(image_pil: Image.Image) -> np.ndarray:
    image_np  = np.array(image_pil.convert("RGB"))
    transform = A.Compose([
        A.Resize(INPUT_SIZE, INPUT_SIZE),
        A.Normalize(mean=MEAN, std=STD),
        ToTensorV2(),
    ])
    return transform(image=image_np)["image"].unsqueeze(0).numpy()


def _postprocess(raw_output: np.ndarray) -> np.ndarray:
    prob = torch.sigmoid(torch.tensor(raw_output)).squeeze().numpy()
    return (prob > THRESHOLD).astype(np.uint8)


def _to_base64_png(array_uint8: np.ndarray) -> str:
    buf = io.BytesIO()
    Image.fromarray(array_uint8).save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


# ── Public API ─────────────────────────────────────────────────────────────
def run_ai_model(image_field) -> dict:
    """
    Returns dict with 'error': True/False.
    On error, 'error_message' explains why.
    """
    # File-level checks
    file_error = _validate_file(image_field)
    if file_error:
        return {"error": True, "error_message": file_error,
                "polyp_detected": False, "polyp_area_pct": 0.0}

    # Open image
    try:
        image_field.open("rb")
        image_pil = Image.open(image_field)
        image_pil.load()
        image_pil = image_pil.convert("RGB")
        orig_w, orig_h = image_pil.size
    except Exception as e:
        return {"error": True, "error_message": f"Cannot read image: {e}",
                "polyp_detected": False, "polyp_area_pct": 0.0}

    # ── Groq vision validation ─────────────────────────────────────────────
    valid, reason = _is_colonoscopy_image(image_pil)
    if not valid:
        return {"error": True, "error_message": reason,
                "polyp_detected": False, "polyp_area_pct": 0.0}

    # Inference
    try:
        inp     = _preprocess(image_pil)
        raw_out = _session.run([_output_name], {_input_name: inp})[0]
        mask    = _postprocess(raw_out)
    except Exception as e:
        return {"error": True, "error_message": f"Model inference failed: {e}",
                "polyp_detected": False, "polyp_area_pct": 0.0}

    # Overlay
    orig_np     = np.array(image_pil.resize((INPUT_SIZE, INPUT_SIZE))).astype(float)
    overlay     = orig_np.copy()
    overlay[mask > 0] = orig_np[mask > 0] * 0.5 + np.array([255, 0, 0]) * 0.5
    polyp_ratio = float(mask.sum()) / (INPUT_SIZE * INPUT_SIZE)

    return {
        "error":           False,
        "error_message":   None,
        "polyp_detected":  bool(mask.any()),
        "polyp_area_pct":  round(polyp_ratio * 100, 4),
        "mask_png_b64":    _to_base64_png((mask * 255).astype(np.uint8)),
        "overlay_png_b64": _to_base64_png(overlay.astype(np.uint8)),
        "original_size":   {"width": orig_w, "height": orig_h},
    }