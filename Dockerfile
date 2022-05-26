FROM node:18

RUN apt update && apt -y upgrade
RUN apt -y install ffmpeg

RUN adduser thebotcat -u 2201
USER thebotcat
WORKDIR /home/thebotcat

RUN touch /home/thebotcat/props.json /home/thebotcat/.env &&\
  mkdir /home/thebotcat/folder &&\
  mkfifo /home/thebotcat/replinp /home/thebotcat/replout /home/thebotcat/dpipe

COPY --chown=thebotcat:thebotcat ./math.min.js /home/thebotcat/math.min.js

# copy package.json in but only the dependencies at first
COPY --chown=thebotcat:thebotcat ./package-basic.json /home/thebotcat/package.json
RUN npm install -f

COPY --chown=thebotcat:thebotcat ./package.json /home/thebotcat/package.json

COPY --chown=thebotcat:thebotcat ./worker.js /home/thebotcat/worker.js
COPY --chown=thebotcat:thebotcat ./index.js /home/thebotcat/index.js
COPY --chown=thebotcat:thebotcat ./common /home/thebotcat/common
COPY --chown=thebotcat:thebotcat ./commands /home/thebotcat/commands

#RUN [ "sed", "-i", "s/version: 'canary'/version: 'normal'/", "/home/thebotcat/index.js" ]

CMD node index.js
