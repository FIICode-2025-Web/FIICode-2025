from ultralytics import YOLO

MODEL = YOLO("yolov8n.pt")


def detect_counts(image_path: str):
    results = MODEL(image_path, imgsz=640)[0]
    classes = results.boxes.cls.tolist()

    vehicle_count = sum(c in {2, 5, 7} for c in classes)
    person_count = sum(c == 0 for c in classes)
    return vehicle_count, person_count
