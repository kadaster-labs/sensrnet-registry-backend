import requests
import pandas as pd

USERNAME, PASSWORD = 'my@email.com', 'my-password'

response = requests.post('http://127.0.0.1:4200/api/auth/login', {'username': USERNAME, 'password': PASSWORD})
t = response.json()['accessToken']

for _, row in pd.read_csv('sensors.csv', delimiter='\t').iterrows():
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

    r = requests.post('http://127.0.0.1:4200/api/sensor', json=data, headers={'Authorization': 'Bearer {}'.format(t)})
    print('Registered {}: received ID: {}.'.format(row['Name'], r.json()['sensorId']))
