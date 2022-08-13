#!/bin/bash

sudo docker run --rm -it --name thebotcat-canary \
  --mount type=bind,source="$(realpath "$(dirname "${BASH_SOURCE[0]}")/../.env")",target=/home/thebotcat/.env,readonly \
  --mount type=bind,source="$(realpath "$(dirname "${BASH_SOURCE[0]}")/../props.json")",target=/home/thebotcat/props.json \
  -e VERSION='canary' \
  --memory 0.8g --memory-swap 0.8g --memory-swappiness 0 thebotcat/thebotcat
