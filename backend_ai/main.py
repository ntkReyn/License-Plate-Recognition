# === KHỐI 1: Thư viện & cấu hình ===
import cv2
import time
import base64
import json
import requests
from datetime import datetime
from ultralytics import YOLO
import easyocr
import os
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH = os.getenv("MODEL_PATH", "yolov8n.pt")
stream_source = os.getenv("CAMERA_STREAM", "0")
CAMERA_STREAM = int(stream_source) if stream_source.isdigit() else stream_source
KAFKA_BROKER = os.getenv("KAFKA_BROKER", "localhost:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "plates_detected")
REST_API_URL = os.getenv("REST_API_URL", "http://backend_db:5000/api/plates")
CAMERA_ID = os.getenv("CAMERA_ID", "CAM01")
CONF_THRESHOLD = float(os.getenv("CONF_THRESHOLD", "0.5"))

model = YOLO(MODEL_PATH)
ocr = easyocr.Reader(['en'])

# === KHỐI 2: Kết nối Kafka (có retry) ===
use_kafka = False
producer = None

try:
    from kafka import KafkaProducer
    for i in range(10):
        try:
            producer = KafkaProducer(
                bootstrap_servers=KAFKA_BROKER,
                value_serializer=lambda m: json.dumps(m).encode('utf-8')
            )
            use_kafka = True
            print(f"[Kafka] Connected to {KAFKA_BROKER}")
            break
        except Exception as e:
            print(f"[Kafka] Attempt {i+1}/5 failed: {e}")
            time.sleep(3)
    if not use_kafka:
        print("[Kafka] All retries failed. Will use REST fallback.")
except Exception as e:
    print(f"[Kafka Import Error] {e}")
    use_kafka = False

# === KHỐI 3: Hàm gửi dữ liệu ===
def send_result(plate, image, timestamp):
    _, buffer = cv2.imencode('.jpg', image)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    payload = {
        "plate": plate,
        "time": timestamp,
        "camera_id": CAMERA_ID,
        "image_base64": img_base64
    }

    if use_kafka and producer:
        try:
            producer.send(KAFKA_TOPIC, value=payload)
            print(f"[Kafka] Sent: {plate}")
            return
        except Exception as e:
            print(f"[Kafka Error] {e}. Using REST fallback.")

    try:
        r = requests.post(REST_API_URL, json=payload)
        print(f"[REST] Sent: {plate} (status {r.status_code})")
    except Exception as e:
        print(f"[REST Error] {e}")

# === KHỐI 4: Hàm chính xử lý video/cam/ảnh ===
def main():
    cap = cv2.VideoCapture(CAMERA_STREAM)
    if not cap.isOpened():
        print(f"[ERROR] Cannot open stream: {CAMERA_STREAM}")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            time.sleep(0.1)
            continue

        results = model(frame)
        for result in results:
            for box in result.boxes:
                if box.conf < CONF_THRESHOLD:
                    continue
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cropped = frame[y1:y2, x1:x2]
                texts = ocr.readtext(cropped, detail=0)
                text = ''.join(texts).replace(" ", "")
                if text:
                    timestamp = datetime.utcnow().isoformat()
                    send_result(text, cropped, timestamp)

        cv2.imshow("License Plate Detection", frame)
        key = cv2.waitKey(1)
        if key == 27 or key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# === KHỐI 5: Khởi động ===
if __name__ == "__main__":
    main()
