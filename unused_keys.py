import os
import re
import json

TRANSLATION_FILE = "messages/en.json"
SOURCE_DIR = "src"

# 👑 Match m.keyName() or m.keyName({...})
KEY_PATTERN = re.compile(
    r"""{?\s*m\.([a-zA-Z0-9_]+)\s*\(\s*(?:{[^}]*})?\s*\)\s*}?"""
)

def get_all_files(directory, extensions={".js", ".ts", ".tsx", ".svelte", ".jsx"}):
    file_paths = []
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_paths.append(os.path.join(root, file))
    return file_paths

def extract_used_keys(file_paths):
    used_keys = set()
    for path in file_paths:
        with open(path, encoding="utf-8", errors="ignore") as f:
            content = f.read()
            matches = KEY_PATTERN.findall(content)
            used_keys.update(matches)
    return used_keys

def load_translation_keys(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
        return set(data.keys())

def main():
    print("🔍 Scannin for m.key({}) and m.key() usage in full codebase fam...\n")

    files = get_all_files(SOURCE_DIR)
    used_keys = extract_used_keys(files)
    all_keys = load_translation_keys(TRANSLATION_FILE)

    unused_keys = sorted(all_keys - used_keys)

    if not unused_keys:
        print("✅ Safe g, all your keys are workin' — no freeloaders out here 🫡")
    else:
        print(f"❌ Found {len(unused_keys)} keys just chillin unused:\n")
        for key in unused_keys:
            print(f" - {key}")

if __name__ == "__main__":
    main()
