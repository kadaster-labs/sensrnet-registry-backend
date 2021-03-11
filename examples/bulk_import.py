# Request an access token through the following URL:
# http://localhost:5556/dex/auth?response_type=id_token&scope=openid+email+profile&client_id=registry-frontend&redirect_uri=http://localhost:4200&nonce=random-nonce
#
# After login is completed, copy access_token from the URL you are redirected to. You can use this token to make calls to the API.

import requests
import pandas as pd

id_token = <PASTE_TOKEN_HERE>

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
