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

## Диаграммы

### High‑level архитектура
```mermaid
flowchart LR
  subgraph Clients
    U1[Landing browser]
    U2[LK browser]
    U3[Admin browser]
  end

  subgraph Frontend[Next.js apps]
    L[landing]
    LK[lk]
    A[admin]
  end

  subgraph Directus
    DAPI[API]
    DAuth[Auth endpoints]
    DB[(Database)]
    DFiles[(Files)]
  end

  subgraph Media[Media pipeline]
    GW[API Gateway]
    UPL[Video Uploader]
    PROC[Video Processor]
    RMQ[(RabbitMQ)]
  end

  subgraph Storage
    LOCAL[shared-uploads]
    S3[(S3)]
    CDN[(CDN)]
  end

  U1 --> L
  U2 --> LK
  U3 --> A

  L --> DAPI
  LK --> DAuth
  A --> DAPI

  LK --> GW
  L --> DFiles

  GW --> LOCAL
  GW -.-> CDN

  UPL --> RMQ
  RMQ --> PROC
  PROC --> LOCAL
  PROC -.-> S3
  CDN --> U2

  DAPI --- DB
  DAPI --- DFiles
```

### Поток загрузки/выдачи видео
```mermaid
sequenceDiagram
  participant Admin
  participant LK as LK (Next.js)
  participant UPL as Uploader
  participant RMQ as RabbitMQ
  participant PROC as Processor
  participant FS as shared-uploads
  participant S3 as S3
  participant GW as Gateway
  participant User

  Admin->>LK: Upload form
  LK->>UPL: POST file
  UPL->>RMQ: publish task
  PROC->>RMQ: consume task
  PROC->>PROC: FFmpeg HLS
  alt dev
    PROC->>FS: write HLS
  else prod
    PROC->>S3: upload HLS
  end
  User->>GW: GET /videos
  GW->>FS: serve (dev)
  GW->>S3: origin (prod)
```

### Поток аутентификации
```mermaid
sequenceDiagram
  participant User
  participant LK as LK (Next.js)
  participant D as Directus

  User->>LK: open /login
  LK->>D: POST /auth/login (credentials: include)
  D-->>LK: Set-Cookie (HttpOnly)
  LK-->>User: redirect /dashboard

  User->>LK: open /dashboard
  LK->>D: GET /users/me
  D-->>LK: 200 or 401
  alt 200
    LK-->>User: render page
  else 401
    LK-->>User: redirect /login
  end

  User->>LK: click logout
  LK->>D: POST /auth/logout
  D-->>LK: 204
  LK-->>User: redirect /login
```
