#!/bin/bash
cd `dirname  $0`
rsync  -vzrt --progress --password-file=.pwd --exclude-from=.syncignore   ../  rsyncer@118.25.95.242::hlsjmerchant_dev