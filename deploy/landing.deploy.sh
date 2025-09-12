#!/usr/bin/env bash
set -euo pipefail

# Деплой микрофронтенда "landing" на сервер Ubuntu с Docker Compose
# Рабочая директория: /opt/garmonia

readonly APP_NAME="landing"
readonly WORKDIR="/opt/garmonia"
readonly COMPOSE_FILE="${WORKDIR}/landing.compose.yml"

# Ожидаемые переменные окружения (передаются из CI):
#   GH_REPOSITORY  — владелец/репозиторий, например: owner/repo
#   IMAGE_TAG      — тег образа, например: main-<shortsha>
#   GHCR_USER      — пользователь GHCR
#   GHCR_TOKEN     — токен GHCR

# Значения по умолчанию (для локального ручного запуска при необходимости)
: "${GH_REPOSITORY:=OWNER/REPO}"
: "${IMAGE_TAG:=latest}"

export IMAGE_REPO="ghcr.io/${GH_REPOSITORY}/frontend-apps-landing"

echo "[deploy] Ensure workdir ${WORKDIR} exists"
sudo mkdir -p "${WORKDIR}"

echo "[deploy] Docker login to GHCR"
if [[ -n "${GHCR_USER:-}" && -n "${GHCR_TOKEN:-}" ]]; then
  echo -n "${GHCR_TOKEN}" | sudo docker login ghcr.io -u "${GHCR_USER}" --password-stdin
else
  echo "[deploy] GHCR credentials not provided; assuming local login already exists"
fi

echo "[deploy] Pull image: ${IMAGE_REPO}:${IMAGE_TAG}"
sudo docker pull "${IMAGE_REPO}:${IMAGE_TAG}"

echo "[deploy] Up service via compose: ${COMPOSE_FILE}"
sudo -E env IMAGE_REPO="${IMAGE_REPO}" IMAGE_TAG="${IMAGE_TAG}" \
  docker compose -f "${COMPOSE_FILE}" --env-file "${WORKDIR}/landing.env" up -d

echo "[deploy] Cleanup old images (dangling)"
sudo docker image prune -f >/dev/null 2>&1 || true

echo "[deploy] Done. Service '${APP_NAME}' should be running."


