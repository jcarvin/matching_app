#!/usr/bin/env bash
docker run --rm -i --net=host -v `pwd`/app:/app jmfirth/webpack "npm run build && ls /app/out"
echo built!