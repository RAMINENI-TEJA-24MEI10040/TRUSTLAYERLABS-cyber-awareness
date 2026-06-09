import os
import json
import urllib.request
import urllib.parse
import time

def translate_batch(texts, target_lang):
    if not texts:
        return []
    combined = "\n".join(texts)
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q={urllib.parse.quote(combined)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=12) as response:
            res = json.loads(response.read().decode('utf-8'))
            full_trans = "".join([part[0] for part in res[0] if part[0]])
            translated_lines = full_trans.split("\n")
            # Clean up whitespace
            translated_lines = [line.strip() for line in translated_lines]
            return translated_lines
    except Exception as e:
        print(f"Error during batch translate to {target_lang}: {e}")
        return None

def translate_individual(text, target_lang):
    if not text.strip():
        return text
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q={urllib.parse.quote(text)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as response:
            res = json.loads(response.read().decode('utf-8'))
            return "".join([part[0] for part in res[0] if part[0]])
    except Exception as e:
        print(f"Error translating '{text[:15]}...' to {target_lang}: {e}")
        return None

def get_flat_keys(d, prefix=''):
    flat = {}
    for k, v in d.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            flat.update(get_flat_keys(v, key))
        elif isinstance(v, list):
            for idx, item in enumerate(v):
                if isinstance(item, str):
                    flat[f"{key}.{idx}"] = item
        elif isinstance(v, str):
            flat[key] = v
    return flat

def set_nested_value(d, key, val):
    parts = key.split('.')
    cur = d
    for i in range(len(parts) - 1):
        p = parts[i]
        if p.isdigit():
            idx = int(p)
            while len(cur) <= idx:
                cur.append(None)
            if cur[idx] is None:
                cur[idx] = [] if parts[i+1].isdigit() else {}
            cur = cur[idx]
        else:
            if p not in cur:
                cur[p] = [] if parts[i+1].isdigit() else {}
            cur = cur[p]
    
    last = parts[-1]
    if last.isdigit():
        idx = int(last)
        while len(cur) <= idx:
            cur.append(None)
        cur[idx] = val
    else:
        cur[last] = val

def merge_missing(en_path, target_path, target_lang):
    print(f"\n==================================================")
    print(f"Syncing keys for '{target_lang}' in {os.path.basename(target_path)}...")
    print(f"==================================================")
    
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    if os.path.exists(target_path):
        with open(target_path, 'r', encoding='utf-8') as f:
            try:
                target_data = json.load(f)
            except Exception as e:
                print(f"Error parsing {target_path}: {e}. Starting fresh.")
                target_data = {}
    else:
        target_data = {}

    en_flat = get_flat_keys(en_data)
    target_flat = get_flat_keys(target_data)

    missing_keys = [k for k in en_flat if k not in target_flat]
    print(f"Total English keys: {len(en_flat)}")
    print(f"Existing keys in target: {len(target_flat)}")
    print(f"Found {len(missing_keys)} missing keys to translate.")

    if not missing_keys:
        print("No missing keys to translate.")
        return

    # Translate in batches of 40
    batch_size = 40
    translated_count = 0
    
    for i in range(0, len(missing_keys), batch_size):
        chunk_keys = missing_keys[i:i+batch_size]
        chunk_texts = [en_flat[k] for k in chunk_keys]
        
        print(f"Translating batch {i//batch_size + 1}/{(len(missing_keys)-1)//batch_size + 1} ({len(chunk_keys)} keys)...")
        
        batch_results = translate_batch(chunk_texts, target_lang)
        
        if batch_results and len(batch_results) == len(chunk_keys):
            for key, val in zip(chunk_keys, batch_results):
                set_nested_value(target_data, key, val)
                translated_count += 1
        else:
            print(f"Batch translate failed or size mismatched. Falling back to individual translation...")
            for key in chunk_keys:
                en_val = en_flat[key]
                trans_val = translate_individual(en_val, target_lang)
                if trans_val is not None:
                    set_nested_value(target_data, key, trans_val)
                    translated_count += 1
                else:
                    set_nested_value(target_data, key, en_val)
        
        time.sleep(0.5)

    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(target_data, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f"Successfully processed {len(missing_keys)} keys (translated: {translated_count}) and updated {target_path}")

def main():
    # Make directory resolution relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.abspath(os.path.join(script_dir, ".."))
    
    locales_dir = os.path.join(base_dir, "src", "i18n", "locales")
    en_path = os.path.join(locales_dir, "en", "translation.json")

    supported_langs = {
        "hi": "hi",
        "ta": "ta",
        "te": "te",
        "gu": "gu",
        "ur": "ur",
        "mr": "mr",
        "bn": "bn",
        "sd": "sd",
        "ml": "ml",
    }

    for lang_dir, code in supported_langs.items():
        target_path = os.path.join(locales_dir, lang_dir, "translation.json")
        merge_missing(en_path, target_path, code)

if __name__ == "__main__":
    main()
