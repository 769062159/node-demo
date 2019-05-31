#!/bin/bash
cd `dirname  $0`
rsync  -arvzup --delete ../dist/*  root@dev.shiqun.api.iyov.io::admin_merchant