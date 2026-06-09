import urllib.request
import urllib.parse
import json

def translate_text(text, target_lang):
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q={urllib.parse.quote(text)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            res = json.loads(response.read().decode('utf-8'))
            return "".join([part[0] for part in res[0] if part[0]])
    except Exception as e:
        print(f"Error during translate: {e}")
        return None

if __name__ == "__main__":
    result = translate_text("Stay Aware. Stay Protected. Stay in Control.", "hi")
    print(f"Hindi translation: {result}")
