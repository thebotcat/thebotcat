FROM node:22.9.0

RUN adduser thebotcat -u 2201

RUN apt update && apt -y upgrade
RUN apt -y install ffmpeg

USER thebotcat
WORKDIR /home/thebotcat

RUN touch props.json .env &&\
  mkdir extra_data &&\
  mkfifo replinp replout dpipe

# copy package.json in but only the dependencies at first
COPY --chown=thebotcat:thebotcat ./package-basic.json package.json
RUN npm install -f

COPY --chown=thebotcat:thebotcat ./package.json package.json

COPY --chown=thebotcat:thebotcat ./worker.js worker.js
COPY --chown=thebotcat:thebotcat ./index.js index.js
COPY --chown=thebotcat:thebotcat ./common common
COPY --chown=thebotcat:thebotcat ./commands commands

CMD ["node", "--trace-warnings", "--pending-deprecation", "--trace-deprecation", "index.js"]
