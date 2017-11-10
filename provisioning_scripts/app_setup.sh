#!/bin/sh
docker run --rm -i --net=host -v `pwd`/excel_service:/app jmfirth/webpack npm install