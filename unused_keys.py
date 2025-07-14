import os
import re
import json

SOURCE_DIR = "src"
LOCALES_DIR = "messages"
LOCALE_FILES = [f for f in os.listdir(LOCALES_DIR) if f.endswith(".json")]
PROTECTED_KEYS = {"$schema"}  # ❌ Never delete these

KEY_PATTERN = re.compile(r"{?\s*m\.([a-zA-Z0-9_]+)\s*\(\s*(?:{[^}]*})?\s*\)\s*}?")

def get_all_files(directory, extensions={".js", ".ts", ".tsx", ".svelte", ".jsx"}):
    files = []
    for root, _, filenames in os.walk(directory):
        for filename in filenames:
            if any(filename.endswith(ext) for ext in extensions):
                files.append(os.path.join(root, filename))
    return files

def extract_used_keys(file_paths):
    used_keys = set()
    for path in file_paths:
        with open(path, encoding="utf-8", errors="ignore") as f:
            content = f.read()
            matches = KEY_PATTERN.findall(content)
            used_keys.update(matches)
    return used_keys

def load_locale(file_path):
    with open(file_path, encoding="utf-8") as f:
        return json.load(f)

def write_locale(file_path, data):
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

def prompt_yes_no(message):
    answer = input(f"\n❓ {message} (yes/no): ").strip().lower()
    return answer == "yes"

def main():
    print("🔍 Scannin your codebase for used keys fam...\n")

    files = get_all_files(SOURCE_DIR)
    used_keys = extract_used_keys(files)
    print(f"✅ Found {len(used_keys)} used keys in codebase.")

    total_keys_removed = 0

    for locale_file in LOCALE_FILES:
        path = os.path.join(LOCALES_DIR, locale_file)
        locale_data = load_locale(path)

        all_keys = set(locale_data.keys())
        clean_keys = all_keys - PROTECTED_KEYS
        unused_keys = sorted(clean_keys - used_keys)

        if unused_keys:
            print(f"\n📂 Locale: {locale_file}")
            print(f"🗑️ Found {len(unused_keys)} unused keys (excluding protected):")
            for key in unused_keys:
                print(f"   - {key}")

            if prompt_yes_no(f"🚨 Delete these from {locale_file}?"):
                for key in unused_keys:
                    del locale_data[key]
                write_locale(path, locale_data)
                total_keys_removed += len(unused_keys)
                print(f"✅ Deleted {len(unused_keys)} keys from {locale_file}")
            else:
                print(f"⛔ Skipped deleting from {locale_file}")
        else:
            print(f"✅ No unused keys in {locale_file} (or only protected)")

    print(f"\n🎯 DONE. Total keys removed: {total_keys_removed}")

if __name__ == "__main__":
    main()
