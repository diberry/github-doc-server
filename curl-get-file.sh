curl --location --request GET 'https://api.github.com' \
--header 'Accept: application/vnd.github.v3.raw' \
--header 'Content-Type: application/json' \
--header 'User-Agent: diberry'

curl --location --request GET 'https://api.github.com/repos/diberry/public-test/forks' \
--header 'Accept: application/vnd.github.v3.raw' \
--header 'Content-Type: application/json' \
--header 'User-Agent: diberry' \
--header 'Cookie: _octo=GH1.1.1279080220.1583979436; logged_in=no'

curl --request PUT --header 'Authorization: token fb5d5de3952da66934a5dbedc01bb9a67c499aa4' --header 'Accept: application/vnd.github.v3.raw'  --location https://api.github.com/repos/diberry/public-test/contents/README-1.md

curl --header 'Authorization: token 2d67b53f96cb6a1575a0caebcf082c27fcf52d5a' --data '{"message":"my message","content":"aGVsbG8=", "committer": {"name": "Dina Berry","email": "diberry@microsoft.com"}}' --header Content-Type:application/json --request PUT https://api.github.com/repos/diberry/public-test/contents/README-1.md




64879d38df78bdc73d0942ce1f849db0a795e9dd