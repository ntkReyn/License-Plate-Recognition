# License Plate Recognition System

**Hệ thống nhận diện biển số xe thời gian thực**

## Mô tả dự án

Dự án xây dựng một hệ thống full-stack để phát hiện và đọc biển số xe trong thời gian thực, bao gồm:

* **backend\_ai**: Xử lý video/ảnh, nhận diện biển số bằng mô hình AI (YOLO + OCR) và xuất sự kiện.
* **backend\_db**: Nhận sự kiện, lưu trữ vào cơ sở dữ liệu và cung cấp API/ WebSocket cho frontend.
* **frontend\_user**: Giao diện hiển thị ảnh, video đã được ghi sẵn, luồng video trực tiếp với overlay biển số và thống kê realtime.
* **frontend\_admin**: Giao diện quản trị (CRUD user, quản lý biển số vi phạm, báo cáo).

## Yêu cầu cài đặt

* Docker
* Docker Compose

## Cấu trúc thư mục

```
License-Plate-Recognition/
├── backend_ai/
├── backend_db/
├── frontend_user/
├── frontend_admin/
├── broker/    
├── docker-compose.yml
├── .env.example
└── Dockerfile
```

## Hướng dẫn khởi động

1. Tạo file `.env` từ mẫu `.env.example` và điều chỉnh biến môi trường.
2. Khởi động toàn bộ dịch vụ:

   ```bash
   docker-compose up --build -d
   ```
3. Truy cập:

   * Frontend User: [http://localhost:8080](http://localhost:8080)
   * Frontend Admin: [http://localhost:8081](http://localhost:8081)

## Liên hệ
