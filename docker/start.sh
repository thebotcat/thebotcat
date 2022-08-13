#!/bin/bash
sudo docker run --rm -it --name thebotcat \
  --mount type=bind,source="$(realpath "$(dirname "${BASH_SOURCE[0]}")/../.env")",target=/home/thebotcat/.env,readonly \
  --mount type=bind,source="$(realpath "$(dirname "${BASH_SOURCE[0]}")/../props.json")",target=/home/thebotcat/props.json \
  --memory 1.5g --memory-swap 1.5g --memory-swappiness 0 thebotcat/thebotcat
