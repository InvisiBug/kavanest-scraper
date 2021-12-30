#!/bin/sh

REGISTRY_IP=192.168.1.61:5000
yarn install && \
yarn build && \
docker build -f ./Dockerfile.kube -t kavanest-scraper . && \
docker tag kavanest-scraper $REGISTRY_IP/kavanest-scraper && \
docker push $REGISTRY_IP/kavanest-scraper && \
rm -r dist
