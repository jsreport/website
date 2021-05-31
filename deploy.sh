#!/bin/bash
export TRAVIS_TAG="1.0.0"
printenv
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -t website .
docker tag website jsreport/website:$TRAVIS_TAG
docker push jsreport/website

git clone https://github.com/pofider/kubernetes.git
cd kubernetes
chmod +x push.sh
./push.sh "website" "jsreport/website"