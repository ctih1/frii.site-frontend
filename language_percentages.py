import os
import json
langs = {}

for file in os.listdir("messages"):
    with open(os.path.join("messages", file), "r", encoding="utf-8") as f:
        langs[file] = len(json.load(f))

eng_keys = langs["en.json"]

for lang, key_amt in langs.items():
    print(lang, round((key_amt/eng_keys)*100))