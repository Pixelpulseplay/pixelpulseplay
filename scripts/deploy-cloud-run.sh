#!/usr/bin/env sh
set -eu

PROJECT_ID="pixelpulseplay-connect"
REGION="northamerica-northeast1"
SERVICE_NAME="pixelpulseplayzone-web"
REPOSITORY="cloud-run-images"
IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${SERVICE_NAME}"
ENV_FILE="/tmp/pixelpulse-cloudrun-env.yaml"

if [ ! -f "${ENV_FILE}" ]; then
  echo "Missing env file: ${ENV_FILE}"
  echo "Create it before deploying."
  exit 1
fi

gcloud builds submit \
  --project "${PROJECT_ID}" \
  --tag "${IMAGE_URI}" \
  .

gcloud run deploy "${SERVICE_NAME}" \
  --project "${PROJECT_ID}" \
  --image "${IMAGE_URI}" \
  --region "${REGION}" \
  --env-vars-file "${ENV_FILE}" \
  --quiet
