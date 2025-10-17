#!/usr/bin/env bash
set -euo pipefail

IMAGE="${DOCKER_IMAGE:-ghcr.io/ORG/REPO:latest}"
TAG_TO_ROLLBACK="${1:-prev}"

echo "Rolling back to ${IMAGE%:*}:${TAG_TO_ROLLBACK}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required on the target host." >&2
  exit 1
fi

export DOCKER_IMAGE="${IMAGE%:*}:${TAG_TO_ROLLBACK}"

docker compose pull
docker compose up -d --remove-orphans
docker image prune -f
