 # Infrastructure (Docker dev setup)

Chạy toàn bộ stack (PostgreSQL + Backend + Frontend) bằng một lệnh duy nhất.

## Yêu cầu

- Docker Desktop (hoặc Docker Engine + Compose v2)
- File `../be/.env` phải tồn tại (copy từ `../be/.env.example` nếu chưa có)

## Chạy

```bash
cd infrastructure
docker compose up --build
```

Lần đầu sẽ build cả 2 image `be` và `fe`. Các lần sau chỉ cần `docker compose up`.

## Service URLs

| Service       | URL                                  |
| ------------- | ------------------------------------ |
| Frontend      | http://localhost:5173                |
| Backend API   | http://localhost:5001                |
| Swagger docs  | http://localhost:5001/api-docs       |
| Health check  | http://localhost:5001/health         |
| PostgreSQL    | `localhost:5435` (user/pass: `postgres`) |

## Hot reload

- **Backend:** sửa file trong `be/`, container tự restart (node --watch).
- **Frontend:** sửa file trong `fe/`, browser tự HMR (Vite + polling).

## Lệnh hay dùng

```bash
# Dừng (giữ data)
docker compose down

# Dừng + xoá data PostgreSQL (reset DB)
docker compose down -v

# Xem log một service
docker compose logs -f be

# Vào shell của một service
docker compose exec be sh
```

## Lưu ý quan trọng

- File `be/.env` đang đặt `DB_HOST=localhost`. Compose **override** thành `DB_HOST=postgres` (tên service) khi chạy trong Docker — không cần sửa file `.env`. Khi bạn `npm run dev` BE local (ngoài Docker), `localhost` vẫn đúng.
- `node_modules` trong container được tách khỏi host (anonymous volume), nên `npm install` chạy trong container không ảnh hưởng host và ngược lại. Nếu thêm dependency mới: `docker compose up --build` hoặc `docker compose exec be npm install <pkg>`.
- Trên macOS, file watching qua bind mount có thể chậm — đã bật `CHOKIDAR_USEPOLLING=true` cho FE để xử lý.
