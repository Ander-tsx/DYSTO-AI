import json
import base64
import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

KEY = os.environ.get("FIELD_ENCRYPTION_KEY").encode()[:32]

def decrypt_payload(payload: str):
    raw = base64.b64decode(payload)

    iv = raw[:16]
    cipher_text = raw[16:]

    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    decrypted = unpad(cipher.decrypt(cipher_text), AES.block_size)

    return json.loads(decrypted.decode())