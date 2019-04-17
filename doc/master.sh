cd `dirname  $0`
rsync  -vzrt --progress ../dist/  root@shiqun.api.iyov.io::admin_merchant