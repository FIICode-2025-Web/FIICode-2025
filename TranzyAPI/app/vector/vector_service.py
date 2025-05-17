import requests
from decouple import config
import json, re

VECTOR_URL    = config("VECTOR_URL")
PIPELINE_NAME = config("VECTOR_PIPELINE_NAME")
API_KEY       = config("VECTOR_API_KEY")

class VectorService:
    def fetch_pipeline(self, text: str) -> dict:
        endpoint = f"{VECTOR_URL}/pipeline/{PIPELINE_NAME}/run"
        headers = {
            "Content-Type":  "application/json",
            "Authorization": f"Bearer {API_KEY}",
        }
        payload = {
            "pipeline_name": PIPELINE_NAME,
            "inputs":        {"input": text},
        }

        resp = requests.post(endpoint, headers=headers, json=payload)
        resp.raise_for_status()

        raw = resp.json().get("outputs", {}).get("output_1", "")
        raw_clean = re.sub(r"<think>.*?</think>\s*", "", raw, flags=re.DOTALL)

        match = re.search(r"\{.*\}", raw_clean, flags=re.DOTALL)
        if not match:
            return {}
        json_block = match.group(0)

        return json.loads(json_block)
