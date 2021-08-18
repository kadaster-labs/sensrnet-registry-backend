import random
import secrets
import requests
import concurrent.futures

URL = 'http://127.0.0.1:3000'
ID_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjRkNzEwNzQzNDY5NWZhMDg1ODg2YmFiNTZkOGU2NGRjYjc4NDhiYTMifQ.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjU1NTYvZGV4Iiwic3ViIjoiQ2dFeEVnVnNiMk5oYkEiLCJhdWQiOiJyZWdpc3RyeS1mcm9udGVuZCIsImV4cCI6MTYyOTI5NDM1NiwiaWF0IjoxNjI5MjA3OTU2LCJub25jZSI6InJhbmRvbS1ub25jZSIsImF0X2hhc2giOiJWRFRIWnNsZHdmNGtpNExFbTNfYXlnIiwiZW1haWwiOiJhZG1pbkBzZW5zcm5ldC5ubCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYWRtaW4ifQ.mrNl1Kq3t19dcomivmAYVQwe7Ne4GT1jknc6VMIZ5jsHlzHVdkMxOKLjYVM131YWaYCEhcCqyMeoq5RP22x_2PMPv0KGGA5nvVoKiQTROj1E2PCXEafJCOWt_KFOdj0yqAZTIPbdnCa7cpnwmdGEUoeTLzvZQmyVuDvKvGdtMOsBmesGLCnfpyC0g_QMOSUhCeMQW_YoJcFmUTaFWDtyejUaNn0C2KoKxB1w6TXpZ75BG0-j6YvwpygWgYfVCyE2cD7SItX6Jf5-fUKxCh0mxoqi2ukbasHapDVRrxljfCSSa1xfLrz474XuXdnyVh9eeIExB7Y2KWFUWfSRjQgbjw'

category_options = ['Sensor', 'Camera', 'Beacon']
netherlands_b_box = [3.31497114423, 50.803721015, 7.09205325687, 53.5104033474]


def get_random_point():
    long = random.uniform(netherlands_b_box[0], netherlands_b_box[2])
    lat = random.uniform(netherlands_b_box[1], netherlands_b_box[3])

    return long, lat


def get_random_category():
    return secrets.choice(category_options)


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
