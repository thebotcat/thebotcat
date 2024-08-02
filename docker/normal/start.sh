#!/bin/bash

sudo docker run --rm -it --name thebotcat \
  --mount type=bind,source="$(realpath "$(dirname "${BASH_SOURCE[0]}")/../../.env")",target=/home/thebotcat/.env,readonly \
  --mount type=bind,source="$(realpath "$(dirname "${BASH_SOURCE[0]}")/../../props.json")",target=/home/thebotcat/props.json \
  --mount type=bind,source="$(realpath "$(dirname "${BASH_SOURCE[0]}")/../../extra_data")",target=/home/thebotcat/extra_data \
  -e VERSION='normal' \
  --memory 0.7g --memory-swap 2.0g thebotcat/thebotcat
