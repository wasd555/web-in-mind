# Архитектура проекта GARMONIA

## 1. Общий обзор
Проект **GARMONIA** — это веб-платформа с авторизацией, системой управления пользователями, защищённым доступом к контенту (видео) и интеграцией с Headless CMS **Directus**.

### Основная цель
- Предоставление пользователям защищённого доступа к контенту (видеоматериалы) через авторизацию.
- Управление пользователями и контентом через Directus.
- Масштабируемая архитектура с разделением фронтенда и бэкенда.

---

## 2. Структура системы

### 2.1. Фронтенд
- **Технологии**:
    - [Next.js](https://nextjs.org/) — фреймворк React с SSR и маршрутизацией.
    - [Tailwind CSS](https://tailwindcss.com/) — утилитарный CSS-фреймворк для стилизации.
    - [TypeScript](https://www.typescriptlang.org/) — строгая типизация.
- **UI-библиотеки и подходы**:
    - Компонентный подход React.
    - Градиенты, фоновые изображения через Tailwind.
    - Навигация с использованием `next/link`.
- **Авторизация**:
    - Логин/регистрация через API Directus.
    - Сессия хранится в **HttpOnly cookie** (через `credentials: "include"`).
    - Проверка авторизации при загрузке страниц (fetch `/users/me`).

---

### 2.2. Бэкенд
- **Directus** — headless CMS, выполняет роль API и панели администратора.
- **Docker Compose** используется для поднятия Directus с нужной БД и конфигурацией.
- **PostgreSQL** как основная база данных.
- Авторизация пользователей:
    - `/auth/login` — аутентификация.
    - `/auth/logout` — завершение сессии.
    - `/users` — управление данными пользователя.
- Контент (видео) хранится в S3-совместимом хранилище (MinIO или Amazon S3).

---

### 2.3. API Gateway (Node.js + Express)
- Обеспечивает проксирование запросов к сервисам.
- Подключает middleware для проверки JWT.
- Обрабатывает маршруты для видео, доступные только авторизованным пользователям.

---

## 3. Интеграции и сервисы

| Сервис / Библиотека | Назначение |
|--------------------|------------|
| **Directus**       | CMS и API для пользователей и контента |
| **PostgreSQL**     | Реляционная база данных |
| **S3 (MinIO/Amazon)** | Хранилище видео и медиафайлов |
| **Next.js**        | Фронтенд и рендеринг |
| **Tailwind CSS**   | Стилизация UI |
| **Node.js + Express** | API Gateway, маршрутизация |
| **JWT**            | Авторизация между сервисами |

---

## 4. Хранение данных
- **Пользователи**: таблица `directus_users` в PostgreSQL (управляется Directus).
- **Видео**: метаданные в Directus, файлы — в S3.
- **Сессии**: хранятся на стороне сервера (Directus) и передаются клиенту через `HttpOnly` cookie.

---

## 5. Поток авторизации

1. Пользователь заходит на страницу входа.
2. Отправляет логин и пароль в Directus `/auth/login`.
3. Directus создаёт сессию и возвращает `HttpOnly` cookie.
4. Фронтенд отправляет запросы с `credentials: "include"`.
5. API проверяет пользователя через `/users/me`.
6. При выходе (`/auth/logout`) сессия уничтожается.

---

## 6. Безопасность
- **HttpOnly cookies** для токенов.
- CORS настроен на доверенные домены.
- Закрытые API маршруты защищены JWT middleware.
- Минимизация хранения чувствительных данных на клиенте.
- 
## Диаграммы

### High‑level архитектура
<!-- flowchart LR
  subgraph Client["Clients"]
    U1[Browser<br/>(Landing)]
    U2[Browser<br/>(LK)]
    U3[Admin]
  end

  subgraph Frontend["Next.js Frontends (Turborepo)"]
    L[landing]
    LK[lk]
    A[admin]
  end

  subgraph Directus["Directus (Docker)"]
    DAPI[REST/GraphQL API]
    DAuth[Auth: /auth/login,/logout,/users/me]
    DB[(DB: SQLite→Postgres)]
    DFiles[(Directus Files)]
  end

  subgraph Media["Media Pipeline (Docker/K8s)"]
    GW[API Gateway<br/>Node/Express]
    UPL[Video Uploader<br/>Multer + RMQ pub]
    PROC[Video Processor<br/>FFmpeg Worker]
    RMQ[(RabbitMQ)]
  end

  subgraph Storage["Storage"]
    LOCAL[/shared-uploads/ (dev)/]
    S3[(S3 / Yandex Object Storage)]
    CDN[(CDN)]
  end

  U1 --> L
U2 --> LK
U3 --> A

L -->|auth, content| DAPI
LK -->|auth (cookies)| DAuth
A -->|admin API| DAPI

LK -->|list/play HLS| GW
L -->|public assets| DFiles

GW -->|static HLS| LOCAL
GW -.prod .-> CDN

UPL --> RMQ
RMQ --> PROC
PROC --> LOCAL
PROC -.prod .-> S3
CDN -->|edge| U2

DAPI --- DB
DAPI --- DFiles -->

### Поток загрузки/выдачи видео
<!-- sequenceDiagram
  autonumber
  actor Admin as Admin (Browser)
  participant LK as LK (Next.js)
  participant UPL as Video Uploader (Express)
  participant RMQ as RabbitMQ
  participant PROC as Video Processor (FFmpeg)
  participant FS as shared-uploads/ (dev)
  participant S3 as S3 Bucket (prod)
  participant GW as API Gateway (HLS)
  actor User as User (Browser)

  Admin->>LK: POST /upload (form/file)
  LK->>UPL: multipart/form-data
  UPL->>UPL: Save temp file, meta
  UPL->>RMQ: publish {filePath, targetDir}
  Note over RMQ: durable queue: video_tasks
  PROC->>RMQ: consume message
  PROC->>PROC: FFmpeg → 1080p/720p/480p + HLS
  alt dev
    PROC->>FS: write master.m3u8 + segments
  else prod
    PROC->>S3: upload HLS objects
  end
  User->>GW: GET /videos → list
  User->>GW: GET /videos/:slug/master.m3u8
  alt dev
    GW->>FS: serve HLS files
  else prod
    GW->>S3: (origin) or CDN
    CDN-->>User: segments
end -->

### Поток аутентификации
<!-- sequenceDiagram
  autonumber
  actor User as User (Browser)
  participant LK as LK (Next.js)
  participant D as Directus

  User->>LK: open /login
  LK->>D: POST /auth/login (email,password)<br/>credentials: include
  D-->>LK: Set-Cookie (HttpOnly access/refresh)
LK-->>User: redirect /dashboard

User->>LK: open /dashboard
LK->>D: GET /users/me (credentials: include)
D-->>LK: 200 user or 401
alt 200
LK-->>User: SSR render protected page
else 401
LK-->>User: redirect /login
end

User->>LK: click Logout
LK->>D: POST /auth/logout (credentials: include)
D-->>LK: 204
LK-->>User: redirect /login -->
