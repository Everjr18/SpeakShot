#!/usr/bin/env sh
set -eu

HOST="${HOST:-http://localhost:3000}"

if command -v curl >/dev/null 2>&1; then
  curl --fail --silent --show-error "${HOST}/api/health" >/dev/null
else
  wget --quiet --spider "${HOST}/api/health"
fi
