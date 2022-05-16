#!/bin/bash
sudo docker build -t thebotcat/thebotcat "$(dirname "${BASH_SOURCE[0]}")/.."
