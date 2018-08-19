cd `dirname  $0`
rsync  -vzrt --progress --password-file=.pwd ../dist/  rsyncer@118.25.95.242::hlsjmerchant