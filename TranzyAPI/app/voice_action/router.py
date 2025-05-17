import shutil
import tempfile

import speech_recognition as sr
from fastapi import APIRouter, File, UploadFile, HTTPException

from app.vector.vector_service import VectorService

voice_router = APIRouter(prefix="/api/v1/voice", tags=["voice"])

voice_service = VectorService()


@voice_router.post(
    "/",
)
def speech_to_text(
        file: UploadFile = File(...)
):
    suffix = file.filename.split(".")[-1]
    with tempfile.NamedTemporaryFile(suffix=f".{suffix}", delete=False) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(tmp_path) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio, language="ro-RO")
            return {"text": text.lower()}
    except sr.UnknownValueError:
        raise HTTPException(status_code=400, detail="Nu am putut înțelege ce ai spus.")
    except sr.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Eroare serviciu recunoaștere: {e}")
