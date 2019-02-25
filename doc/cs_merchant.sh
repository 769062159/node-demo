#!/bin/bash
cd `dirname  $0`
rsync  -vzrt --progress   ../dist/  rsyncer@118.25.95.242::hlsjmerchant_dev