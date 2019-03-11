# TODO - Facebook data to mongo
import json

import requests

CONFIG_JSON_FILE_NAME = "../config.json"
FACEBOOK_KEY = "facebook"


def get_facebook_access_token(facebook_keys):
    return facebook_keys["accessToken"]


def get_facebook_keys(config):
    return config["keys"][FACEBOOK_KEY]


# TODO - Test
def get_facebook_pages(sources_json):
    facebook_pages = []

    for source in sources_json:
        if source['platform'] == 'facebook' and source['valueType'] == 'page':
            facebook_pages.append(source['value'])

    return facebook_pages


with open(CONFIG_JSON_FILE_NAME) as file:
    config = json.load(file)

facebook_access_token = get_facebook_access_token(get_facebook_keys(config))

session = requests.session()
session.params = {}
response = session.get("http://localhost:8080/sources/")
sources_json = json.loads(response.content.decode("utf-8"))

facebook_pages = get_facebook_pages(sources_json)
