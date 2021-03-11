# Request an access token through the following URL:
# http://localhost:5556/dex/auth?response_type=id_token&scope=openid+email+profile&client_id=registry-frontend&redirect_uri=http://localhost:4200&nonce=random-nonce
#
# After login is completed, copy access_token from the URL you are redirected to. You can use this token to make calls to the API.

import requests
import pandas as pd

id_token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2ZDliNzE3MGJjNjVlYjk4YTg0MmQyM2RmOGExMTQ2MjA5ZTE1YzkifQ.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAvZGV4Iiwic3ViIjoiQ2dFeEVnVnNiMk5oYkEiLCJhdWQiOiJyZWdpc3RyeS1mcm9udGVuZCIsImV4cCI6MTYxNTU0MzU5MywiaWF0IjoxNjE1NDU3MTkzLCJub25jZSI6InJhbmRvbS1ub25jZSIsImF0X2hhc2giOiJhdTk5LUVsNjcxSzRXY3o0MV85R3ZnIiwiZW1haWwiOiJhZG1pbkBzZW5zcm5ldC5ubCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYWRtaW4ifQ.VNXTRn2BHjtWOEnxYryHv7UUo9Gf8dylCsqpZPTBFGJIAVzg-bWXaKXiATVB48LlidJBY-tDLvYiQtEw7YEolIiZdQWOlVaat-TJQh9XZrTZmCL1MTorloxVDXFIwiyVadNWAuSWlrRYwZjHVDqvEts6_eMdtDrMSucKmKypBAikvQlv0-Ep_Nc_nRZQHePrIbhDktSQajzkrgwj_qkdmE_fPPUMUnpv__JqY5u7I0WZNMQZdC6BrbanqYUXpFwPbI8ZG2iOkn0xxPoYoXwEvYCwZMxsebjlFmzuY-ovcV0uP5BCTfTUa67MuzRDhWTwuLpInSk6KFfonQVExG3n6A'

for _, row in pd.read_csv('sensors.csv', delimiter='\t').iterrows():
    data = {
        'category': row['Category'],
        'typeName': row['Type'],
        'name': row['Name'],
        'active': row['Active'],
        'description': row['Description'], 'dataStreams': [],
        'location': [
            row['Longitude'],
            row['Latitude'],
            row['Height']
        ]
    }

    r = requests.post('http://localhost:3000/api/sensor', json=data, headers={'Authorization': 'Bearer {}'.format(id_token)}).json()

    if 'statusCode' in r.keys() and r['statusCode'] != 200:
        print(r['error'], r['message'])
        continue

    print('Registered {}: received ID: {}.'.format(row['Name'], r['sensorId']))
