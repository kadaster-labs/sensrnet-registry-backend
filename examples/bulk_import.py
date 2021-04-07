import requests
import pandas as pd

URL = 'http://localhost:3000'

# Request an access token through the following URL:
# http://localhost:5556/dex/auth?response_type=id_token&scope=openid+email+profile&client_id=registry-frontend&redirect_uri=http://localhost:4200&nonce=random-nonce
#
# After login is completed, copy access_token from the URL you are redirected to. You can use this token to make calls to the API.
ID_TOKEN = <PASTE_ID_TOKEN_HERE >

for _, row in pd.read_csv('devices.csv', delimiter=';').iterrows():
    data = {
        'name': row['Name'],
        'category': row['Category'],
        'description': row['Description'],
        'dataStreams': [],
        'location': {
            'location': [
                row['Longitude'],
                row['Latitude'],
                row['Height']
            ],
        }
    }

    r = requests.post('{}/api/device'.format(URL), json=data,
                      headers={'Authorization': 'Bearer {}'.format(ID_TOKEN)})

    response = r.json()
    if 'statusCode' in response.keys() and response['statusCode'] != 200:
        print(response['error'], response['message'])
        continue

    print('Registered {}: received ID: {}.'.format(
        row['Name'], response['deviceId']))
