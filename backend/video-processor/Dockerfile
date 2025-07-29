FROM node:20-alpine

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Устанавливаем ffmpeg
RUN apk add --no-cache ffmpeg

# Копируем весь код
COPY . .

USER node

CMD ["npm", "run", "dev"]
