FROM node:20-alpine
WORKDIR /app

# Установим curl для healthcheck заранее
RUN apk add --no-cache curl

# Переменные окружения
ENV NODE_ENV=development
# PORT придёт из docker-compose (environment: PORT=8000)
# EXPOSE носит информационный характер, оставим 8000 по договорённости
EXPOSE 8000

# Сначала зависимости — для кеша
COPY package*.json ./
# Используй ci, если есть package-lock.json (иначе оставь npm install)
# RUN npm ci
RUN npm install

# Затем исходники
COPY . .

# Healthcheck на /live, порт берём из env (по умолчанию 8000)
HEALTHCHECK --interval=15s --timeout=3s --retries=5 \
  CMD curl -fsS http://localhost:${PORT:-8000}/live || exit 1

# В dev обычно используем nodemon; у тебя в compose уже command: npm run dev
CMD ["npm", "run", "dev"]