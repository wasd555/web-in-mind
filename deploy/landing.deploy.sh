#!/usr/bin/env bash
set -euo pipefail

# Деплой микрофронтенда "landing" на сервер Ubuntu с Docker Compose
# Рабочая директория: /opt/garmonia

readonly APP_NAME="landing"
readonly WORKDIR="/opt/garmonia"
readonly COMPOSE_FILE="${WORKDIR}/landing.compose.yml"

# Ожидаемые переменные окружения (передаются из CI):
#   GH_REPOSITORY  — владелец/репозиторий, например: owner/repo (нижним регистром)
#   IMAGE_TAG      — тег образа, например: main-<shortsha>
#   GHCR_USER      — пользователь GHCR (для private pull)
#   GHCR_TOKEN     — токен GHCR (PAT с read:packages)

# Значения по умолчанию (для ручного запуска)
: "${GH_REPOSITORY:=OWNER/REPO}"
: "${IMAGE_TAG:=latest}"

export IMAGE_REPO="ghcr.io/${GH_REPOSITORY}/frontend-apps-landing"

echo "[deploy] Ensure workdir ${WORKDIR} exists"
sudo mkdir -p "${WORKDIR}"

echo "[deploy] Docker login to GHCR (if creds provided)"
if [[ -n "${GHCR_USER:-}" && -n "${GHCR_TOKEN:-}" ]]; then
  echo -n "${GHCR_TOKEN}" | sudo docker login ghcr.io -u "${GHCR_USER}" --password-stdin
else
  echo "[deploy] GHCR credentials not provided; assuming public image or prior login"
fi

echo "[deploy] Pull image: ${IMAGE_REPO}:${IMAGE_TAG}"
sudo docker pull "${IMAGE_REPO}:${IMAGE_TAG}"

echo "[deploy] Compose up: ${COMPOSE_FILE}"
sudo -E env IMAGE_REPO="${IMAGE_REPO}" IMAGE_TAG="${IMAGE_TAG}" \
  docker compose -f "${COMPOSE_FILE}" --env-file "${WORKDIR}/landing.env" up -d

# --- АВТОЧИСТКА НЕИСПОЛЬЗУЕМЫХ ОБРАЗОВ ---
# Оставляет только образы, за которыми стоят запущенные контейнеры
echo "[deploy] Disk usage before prune:"
sudo docker system df || true

echo "[deploy] Prune unused images (keep only images used by running containers)"
sudo docker image prune -af || true

# (опционально) зачистить неиспользуемые контейнеры/сети; volume-ы не трогаем
# sudo docker container prune -f || true
# sudo docker network prune -f || true

# (опционально) подчистить build cache, если его много
# sudo docker builder prune -af --keep-storage=1GB || true

echo "[deploy] Disk usage after prune:"
sudo docker system df || true

echo "[deploy] Done. Service '${APP_NAME}' should be running."