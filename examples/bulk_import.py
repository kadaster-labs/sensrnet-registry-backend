import requests
import pandas as pd

USERNAME, PASSWORD = 'my@email.com', 'my-password'
URL = 'http://localhost:3000'

response = requests.post('{}/api/auth/login'.format(URL), {'username': USERNAME, 'password': PASSWORD})
t = response.json()['accessToken']

for _, row in pd.read_csv('devices.csv', delimiter=';').iterrows():
    data = {
        'name': row['Name'],
        'category': row['Category'],
        'description': row['Description'], 'dataStreams': [],
        'location': {
            'location': [row['Longitude'], row['Latitude'], row['Height']],
        }
    }

    r = requests.post('{}/api/device'.format(URL), json=data, headers={'Authorization': 'Bearer {}'.format(t)})
    print('Registered {}: received ID: {}.'.format(row['Name'], r.json()['deviceId']))
