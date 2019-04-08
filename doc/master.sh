cd `dirname  $0`
rsync  -vzrt --progress ../dist/  rsync@shiqun.api.iyov.io::admin_merchant