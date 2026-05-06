#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

curl -L "https://geoshape.ex.nii.ac.jp/city/topojson/20230101/jp_city.c.topojson" \
  -o "data/jp_city.c.topojson"

node "scripts/extract-hyogo-boundaries.mjs"
