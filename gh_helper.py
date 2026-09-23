#!/usr/bin/env python3
"""nocodecsv repo helpers: fetch/put files via GitHub API."""
import base64, json, os, sys, urllib.request, urllib.error, re

REPO = "CindyLiao1106/nocodecsv"
TOKEN = None
for line in open("/opt/data/.env"):
    if line.startswith("GITHUB_TOKEN="):
        TOKEN = line.split("=", 1)[1].strip().strip('"').strip("'")
        break
assert TOKEN, "no GITHUB_TOKEN"


def api(path, method="GET", body=None):
    url = f"https://api.github.com/{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Accept", "application/vnd.github+json")
    if data:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {"_error": e.code, "_body": e.read().decode()[:500]}


def get_file(path, branch="master"):
    d = api(f"repos/{REPO}/contents/{path}?ref={branch}")
    if "_error" in d:
        return None, None, d
    return base64.b64decode(d["content"]).decode(), d["sha"], d


def put_file(path, content, message, sha=None, branch="master"):
    body = {"message": message, "content": base64.b64encode(content.encode()).decode(), "branch": branch}
    if sha:
        body["sha"] = sha
    return api(f"repos/{REPO}/contents/{path}", method="PUT", body=body)


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "get":
        c, sha, d = get_file(sys.argv[2])
        if c is None:
            print("ERROR", d)
        else:
            print(c, end="")
    elif cmd == "ls":
        d = api(f"repos/{REPO}/contents/{sys.argv[2]}")
        for x in d:
            print(x["type"], x["name"])
