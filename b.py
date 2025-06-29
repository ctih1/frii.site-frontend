import os
import json
import re

def replace_vars(obj):
    if isinstance(obj, dict):
        return {k: replace_vars(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [replace_vars(i) for i in obj]
    elif isinstance(obj, str):
        return re.sub(r'%(\w+)%', r'{\1}', obj)
    else:
        return obj

def process_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            print(f"⚠️ File ain't valid JSON fam: {file_path}")
            return

    updated = replace_vars(data)

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(updated, f, indent=2, ensure_ascii=False)
        print(f"✅ Processed: {file_path}")

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                process_json_file(file_path)

# 🔥 Plug in your folder path here
folder_path = r"C:\Users\nevalaonni\frii.site-frontend\messages"  # 👉🏽 Change this to the dir you want

process_directory(folder_path)
