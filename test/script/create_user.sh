curl -X POST http://localhost:3000/api/v1/users -d @./test/json/create_user.json -H "Content-Type: application/json" |  python3 -m json.tool --indent 1 --no-ensure-ascii