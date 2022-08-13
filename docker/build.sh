#!/bin/bash

cd "${0%/*}/.."

sudo docker build -t thebotcat/thebotcat .
