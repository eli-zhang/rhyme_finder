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

## Replaces all dictionary entries that weren't processed successfully with their proper pronunciations or deletes them if unsuccessful
# with open('pronunciations.json', encoding="utf-8") as output:
#     words = json.load(output)
#     to_be_deleted = []
#     for key, value in words.items():
#         if value == 1:
#             url = "https://www.merriam-webster.com/dictionary/{}?utm_campaign=sd&utm_medium=serp&utm_source=jsonld".format(key)
#             response = requests.get(url)
#             soup = BeautifulSoup(response.text, "lxml")
#             html = soup.find("span", class_="pr")
#             if not html:
#                 to_be_deleted.append(key)
#             else:
#                 pronunciation = html.get_text().strip()
#                 print(pronunciation)
#                 words[key] = pronunciation
#                 print("replaced {} with {} for {}".format(value, pronunciation, key))
#     for key in to_be_deleted:
#         del words[key]
#     with open('new_pronunciations.json', 'a+', encoding="utf-8") as new_output:
#         json.dump(words, new_output, sort_keys=True, indent=2, ensure_ascii=False)