import json

target = input("Enter your desired language (e.g pl.json)")
en = {}
locale = {}

new_locale = {}
with open(f"messages/{target}", encoding="utf-8") as f:
    locale = json.load(f)

with open(f"messages/en.json", encoding="utf-8") as f:
    en = json.load(f)

for key, val in en.items():
    new_locale[key] = locale.get(key, en.get(key))

print(json.dumps(new_locale, indent=4, ensure_ascii=False))
