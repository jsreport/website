FROM node:alpine
EXPOSE 5488

RUN addgroup -S jsreport && adduser -S -G jsreport jsreport 

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && apk update --no-cache \
  && apk add --no-cache \  
  git \
  # so user can docker exec -it test /bin/bash
  bash \
  && rm -rf /var/cache/apk/* /tmp/*

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/package.json

RUN npm install --production && \
  npm cache clean -f && \
  rm -rf /tmp/*    

COPY . /app

EXPOSE 2000

CMD ["npm", "start"] 