#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -t website .
docker tag website jsreport/website:1.0.0
docker push jsreport/website:1.0.0

git clone https://github.com/pofider/kubernetes.git
cd kubernetes
chmod +x push.sh
./push.sh "website" "jsreport/website"