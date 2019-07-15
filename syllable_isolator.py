import json
import re
from collections import defaultdict

groups = defaultdict(set)

with open('pronunciations.json', encoding="utf8") as pronunciations:
    for word, prn in json.load(pronunciations).items():
        options = prn.split(' ')
        word_filter = re.compile('[\'ˈˌ-]')
        real_words = set(filter(word_filter.match, options))
        for option in real_words:
            vowels = re.sub('[pbmtdnkgfvsztdljwhŋr]', '', option).strip()
            print('{}: {}'.format(word, vowels))
            groups[vowels].add(word)
