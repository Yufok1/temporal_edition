import requests
import json
import hashlib
import random
import time

ENDPOINTS = [
    {
        "url": "http://localhost:8000/wallet/divine",
        "lawful": {
            "signature": hashlib.sha256(b"lawful-message").hexdigest(),
            "message": "lawful-message",
            "sigil": "glyph-hash-01",
            "session_key": "lawful-session-key"
        },
        "adversarial": {
            "signature": "bad-signature",
            "message": "malicious-message",
            "sigil": "invalid-sigil",
            "session_key": "invalid-session-key"
        }
    },
    {
        "url": "http://localhost:8000/codex/access",
        "lawful": {
            "signature": hashlib.sha256(b"codex-access").hexdigest(),
            "message": "codex-access",
            "sigil": "glyph-hash-02",
            "session_key": "codex-session-key"
        },
        "adversarial": {
            "signature": "wrong",
            "message": "intruder",
            "sigil": "bad",
            "session_key": "nope"
        }
    },
    {
        "url": "http://localhost:8000/governance/api",
        "lawful": {
            "signature": hashlib.sha256(b"governance").hexdigest(),
            "message": "governance",
            "sigil": "glyph-hash-01",
            "session_key": "gov-session-key"
        },
        "adversarial": {
            "signature": "fake",
            "message": "attack",
            "sigil": "wrong",
            "session_key": "bad"
        }
    }
]

MIRROR_DEPTH_LIMIT = 5

results = []

def probe(endpoint, payload, label):
    for depth in range(MIRROR_DEPTH_LIMIT + 2):
        data = payload.copy()
        data["mirror_depth"] = depth
        start = time.time()
        try:
            resp = requests.post(endpoint, json=data, timeout=5)
            elapsed = time.time() - start
            try:
                out = resp.json()
            except Exception:
                out = {"raw": resp.text}
            entropy = len(set(json.dumps(data))) / max(len(json.dumps(data)), 1)
            result = {
                "endpoint": endpoint,
                "label": label,
                "depth": depth,
                "status_code": resp.status_code,
                "entropy": entropy,
                "response": out,
                "elapsed": elapsed
            }
            results.append(result)
            print(f"[Probe] {label} | {endpoint} | Depth: {depth} | Status: {resp.status_code} | Entropy: {entropy:.4f}")
            if out.get("mirror"):
                print(f"  -> Mirror trap activated: {out.get('reason', '')}")
        except Exception as e:
            print(f"[Probe] {label} | {endpoint} | Depth: {depth} | ERROR: {e}")
            results.append({"endpoint": endpoint, "label": label, "depth": depth, "error": str(e)})

if __name__ == "__main__":
    for ep in ENDPOINTS:
        print(f"\n--- Probing {ep['url']} (lawful) ---")
        probe(ep["url"], ep["lawful"], "lawful")
        print(f"\n--- Probing {ep['url']} (adversarial) ---")
        probe(ep["url"], ep["adversarial"], "adversarial")
    # Output results to JSON
    with open("mkp_probe_results.json", "w") as f:
        json.dump(results, f, indent=2)
    print("\n[Probe] Results written to mkp_probe_results.json") 