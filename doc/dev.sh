#!/bin/bash
cd `dirname  $0`
rsync  -vzrt --progress   ../dist/  root@dev.shiqun.api.iyov.io::admin_merchant