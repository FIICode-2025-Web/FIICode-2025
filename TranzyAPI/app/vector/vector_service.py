import requests
from decouple import config
import json
import re

VECTOR_URL = config("VECTOR_URL")
PIPELINE_ID = config("VECTOR_PIPELINE_NAME")
USERNAME = config("VECTOR_USERNAME")
API_KEY = config("VECTOR_API_KEY")



class VectorService:
    def fetch_pipeline(
        self,
        departure_place: str,
        arrival_place:   str,
        departure_time:  str
    ) -> dict:
        endpoint = f"https://api.vectorshift.ai/v1/pipeline/679c91bdf7a15849e2362ad2/run"
        headers = {
            "Content-Type":  "application/json",
            "Authorization": f"Bearer {API_KEY}",
        }
        payload = {
            "pipeline_name": PIPELINE_ID,
            "username":      USERNAME,
            "inputs": {
                "departure_place": departure_place,
                "arrival_place":   arrival_place,
                "departure_time":  departure_time,
            }
        }

        resp = requests.post(endpoint, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        raw = data.get("outputs", {}).get("output_1", "")

        raw_clean = re.sub(r"<think>.*?</think>\s*", "", raw, flags=re.DOTALL)

        start = raw_clean.find("{")
        end   = raw_clean.rfind("}") + 1
        json_block = raw_clean[start:end]

        return json.loads(json_block)