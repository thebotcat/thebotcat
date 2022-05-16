#!/bin/bash
sudo docker run --rm -it --name thebotcat \
  --mount type=bind,source="$(realpath "$(dirname "${BASH_SOURCE[0]}")/../.env")",target=/home/thebotcat/.env,readonly \
  --mount type=bind,source="$(realpath "$(dirname "${BASH_SOURCE[0]}")/../props.json")",target=/home/thebotcat/props.json \
  thebotcat/thebotcat
