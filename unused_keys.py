import os
import json
import re

SRC_DIR = "src"
LOCALE_FILE = "messages/en.json"  # change this
LOCALES_DIR = "messages"
PROTECTED_KEYS = {"$schema"}  # keys to never delete

def get_all_source_files(directory):
    files = []
    for root, _, filenames in os.walk(directory):
        if "paraglide" in root:
            continue
        for filename in filenames:
            if not filename.endswith(".json"):  # skip JSON files
                files.append(os.path.join(root, filename))
    return files

def is_key_used(key, files):
    pattern = re.compile(r"\b" + re.escape(key) + r"\b")
    for file in files:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
            if "api_dashboard" in key or key in content:
                return True

    print(f"Couldnt find key {key}")
    return False

def clean_locales():
    # load the canonical keys from en.json
    en_file = os.path.join(LOCALES_DIR, "en.json")
    with open(en_file, "r", encoding="utf-8") as f:
        en_data = json.load(f)
    canonical_keys = set(en_data.keys())

    # list all JSON files
    locale_files = [f for f in os.listdir(LOCALES_DIR) if f.endswith(".json")]

    # get all source files once
    source_files = get_all_source_files(SRC_DIR)

    total_removed = 0

    for locale_file in locale_files:
        path = os.path.join(LOCALES_DIR, locale_file)
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        removed_count = 0
        for key in list(data.keys()):
            if key in PROTECTED_KEYS:
                continue
            if key not in canonical_keys or not is_key_used(key, source_files):
                del data[key]
                removed_count += 1
                print(f"🗑️ Removed {key} from {locale_file}")

        if removed_count > 0:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                f.write("\n")
            total_removed += removed_count

    print(f"\n✅ Done. Total keys removed: {total_removed}")

if __name__ == "__main__":
    clean_locales()