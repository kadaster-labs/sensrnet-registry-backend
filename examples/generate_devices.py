import random
import requests
import concurrent.futures

URL = 'URL'
ID_TOKEN = 'ID-TOKEN'

category_options = ['Sensor', 'Camera', 'Beacon']
netherlands_b_box = [3.31497114423, 50.803721015, 7.09205325687, 53.5104033474]


def get_random_point():
    long = random.uniform(netherlands_b_box[0], netherlands_b_box[2])
    lat = random.uniform(netherlands_b_box[1], netherlands_b_box[3])

    return long, lat


def get_random_category():
    return random.choice(category_options)


def perform_request(i):
    long, lat = get_random_point()
    category = get_random_category()

    data = {
        'name': 'My {}'.format(category),
        'category': category,
        'location': {
            'location': [
                long, lat, 5
            ],
        }
    }

    r = requests.post('{}/api/device'.format(URL), json=data, headers={'Authorization': 'Bearer {}'.format(ID_TOKEN)})
    response = r.json()

    if 'statusCode' in response.keys() and response['statusCode'] != 200:
        print(response['error'], response['message'])
    else:
        print('Registered {} {}: received ID: {}.'.format(i, category, response['deviceId']))


with concurrent.futures.ThreadPoolExecutor(max_workers=1000) as executor:
    res = [executor.submit(perform_request, i) for i in range(1000000)]
    concurrent.futures.wait(res)
