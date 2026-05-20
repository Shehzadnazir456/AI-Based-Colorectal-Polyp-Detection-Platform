from django.conf import settings
from openai import OpenAI


def ask_openai(question: str) -> str:
    """
    OpenAI-backed medical assistant response.
    Falls back gracefully when API key is not configured.
    """
    if not settings.OPENAI_API_KEY:
        return "OpenAI API key not configured. Please set OPENAI_API_KEY in .env."

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful colorectal screening assistant. "
                    "Provide concise, non-diagnostic educational guidance."
                ),
            },
            {"role": "user", "content": question},
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content or ""

