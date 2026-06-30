# PolyGuard AI — AI-Based Early Polyp Detection System

PolyGuard AI is a full-stack web application that assists in the early detection of colorectal polyps from colonoscopy images using a deep learning segmentation model, combined with an AI-powered chatbot for report explanation and patient/clinician support.

## Overview

Colorectal cancer is largely preventable when polyps are detected and removed early. PolyGuard AI streamlines this process by allowing clinicians to upload colonoscopy images, automatically segment and detect polyps using a trained EfficientUNet model, classify risk, and generate patient-friendly explanations via an integrated LLM chatbot.

## Tech Stack

**Backend**
- Django REST Framework (Python)
- PostgreSQL (database)
- ONNX Runtime — for running the EfficientUNet polyp segmentation model
- Groq API (LLaMA models) — for AI chatbot / report explanation
- JWT Authentication

**Frontend**
- React (Vite)
- Plain CSS (no UI framework)
- jsPDF — for downloadable PDF reports
- Axios — API communication

**Machine Learning**
- EfficientUNet architecture, exported to ONNX format
- Image preprocessing pipeline for colonoscopy frames
- Risk classification logic post-segmentation

## Core Features

- Upload colonoscopy images for analysis
- Automated polyp segmentation using the EfficientUNet ONNX model
- Risk classification (e.g., low / medium / high risk indicators)
- Expandable patient report cards with segmentation overlay and risk details
- AI chatbot (Groq LLaMA) for explaining results in plain language
- PDF report generation and download
- JWT-based authentication for clinicians/users
- PostgreSQL-backed data persistence for patients, scans, and reports

