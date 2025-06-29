import re
import os

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()

    # 💸 Swap $t("some_key") ➤ m.some_key()
    content = re.sub(r'\$t\(\s*["\']([\w\d_]+)["\']\s*\)', r'm.\1()', content)

    # 🔥 Remove import { t, ... } from "$lib/translations";
    content = re.sub(
        r'import\s+\{\s*t\s*(,\s*\w+\s*)?\}\s+from\s+[\'"]\$lib/translations[\'"];?',
        content
    )

    # ✨ Save back the new drip
    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(content)

    print(f"💾 File updated: {filepath}")

# 🧠 Lil loop for entire folder if u want to rinse multiple files
def run_on_folder(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.js') or file.endswith('.ts') or file.endswith('.svelte'):
                replace_in_file(os.path.join(root, file))

# 🫡 Change this path to ya file/folder
# replace_in_file('path/to/your/file.js')
# OR 🔂 whole directory
run_on_folder(r'C:\Users\nevalaonni\frii.site-frontend\src')


