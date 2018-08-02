#!/bin/bash
ssh -t root@114.55.92.151 "rm -rf /data/wwwroot/hlsj_merchant/dist/"
scp -r  ../dist/ root@114.55.92.151:/data/wwwroot/hlsj_merchant/dist/