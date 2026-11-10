# Todo App

Oddiy Todo ilovasi: **backend** — Java (Spring Boot), **frontend** — oddiy HTML/CSS/JS, **db** — PostgreSQL.

Docker fayllari (Dockerfile'lar, docker-compose.yml) ataylab yozilmagan — ularni o'zing yozib, Docker'ni o'rganishing uchun.

## Struktura

```
backend/   -> Spring Boot ilova (Maven, Java 21)
frontend/  -> static HTML/CSS/JS (index.html, style.css, script.js)
db/        -> init.sql (jadval sxemasi, Postgres init skripti sifatida ishlatish mumkin)
```

## Backend haqida bilishing kerak bo'lgan narsalar

- Build: `mvn clean package -DskipTests` → natija: `target/todo.jar`
- Ishga tushirish: `java -jar todo.jar`
- Standart port: `8080` (env: `SERVER_PORT`)
- PostgreSQL ulanish uchun kutiladigan env o'zgaruvchilar:
  - `DB_HOST` (default: `localhost`)
  - `DB_PORT` (default: `5432`)
  - `DB_NAME` (default: `tododb`)
  - `DB_USER` (default: `postgres`)
  - `DB_PASSWORD` (default: `postgres`)
  - `ALLOWED_ORIGIN` — CORS uchun frontend manzili (default: `http://localhost:*`)
- Jadvalni avtomatik yaratadi (`ddl-auto=update`), shuning uchun `db/init.sql` ishlatish ixtiyoriy.

## Frontend haqida

Toza static fayllar — nginx (yoki boshqa web-server) image orqali servis qilish mumkin. `script.js` ichida backend manzili:

```js
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8080/api/todos';
```

Agar backend konteynerini boshqa portga chiqarsang, shu manzilni moslashtirish kerak bo'ladi.

## DB haqida

`db/init.sql` — `todos` jadvalini yaratuvchi skript. Postgres image'ida `/docker-entrypoint-initdb.d/` papkasiga shu faylni qo'shsang, konteyner birinchi marta ishga tushganda avtomatik bajariladi.

## API endpoint'lar

- `GET /api/todos` — barcha vazifalar
- `POST /api/todos` — yangi vazifa (`{ "title": "..." }`)
- `PUT /api/todos/{id}` — yangilash (`{ "title": "...", "completed": true }`)
- `DELETE /api/todos/{id}` — o'chirish

Sen yozishing kerak bo'lgan fayllar: `backend/Dockerfile` (siz yuborgan andoza shu papkaga mos), `frontend/Dockerfile` (masalan nginx asosida), `db/Dockerfile` (ixtiyoriy, oddiy `postgres` image'ini compose orqali ham ishlatish mumkin) va bularni bog'laydigan `docker-compose.yml`.
