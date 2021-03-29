import requests
import pandas as pd

USERNAME, PASSWORD = 'my@email.com', 'my-password'
URL = 'http://gemeente-a-sensrnet.westeurope.cloudapp.azure.com'

response = requests.post('{}/api/auth/login'.format(URL), {'username': USERNAME, 'password': PASSWORD})
t = response.json()['accessToken']

for _, row in pd.read_csv('sensors.csv', delimiter=';').iterrows():
    data = {
        'category': row['Category'],
        'typeName': row['Type'],
        'name': row['Name'],
        'active': row['Active'],
        'description': row['Description'], 'dataStreams': [],
        'location': {
            'latitude': row['Latitude'],
            'longitude': row['Longitude'],
            'height': row['Height']
        }
    }

    r = requests.post('{}/api/sensor'.format(URL), json=data, headers={'Authorization': 'Bearer {}'.format(t)})
    print('Registered {}: received ID: {}.'.format(row['Name'], r.json()['sensorId']))
