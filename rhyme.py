import requests
import urllib.request
import time
import json
from bs4 import BeautifulSoup

with open('words_dictionary.json') as words_json:
    words = json.load(words_json)
    for word in words:
        url = "https://www.merriam-webster.com/dictionary/{}?utm_campaign=sd&utm_medium=serp&utm_source=jsonld".format(word)
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "lxml")
        html = soup.find("span", class_="pr")
        if not html:
            del word
        else:
            pronunciation = html.get_text()
            print(pronunciation)
            words[word] = pronunciation
    json.dump(words, "pronunciations.json", sort_keys=True, indent=4)
