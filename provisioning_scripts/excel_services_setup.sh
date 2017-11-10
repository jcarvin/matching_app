#!/bin/sh
docker run --rm -i --net=host -v `pwd`/app:/app jmfirth/webpack npm install