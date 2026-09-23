#!/usr/bin/env python3
"""Humanizer audit: AI-marker density, dash density, fake-rhythm tells."""
import re, sys, glob

AI_WORDS = ["significant","crucial","notably","comprehensive","insights","robust",
            "leverage","foster","landscape","nuanced","streamline","elevate",
            "delve","tapestry","realm","seamless","cutting-edge","game-changer",
            "in today's","it's worth noting","let me be honest"]
FAKE_RHYTHM = [r"\b\w+\.\s+[A-Z]\w+\.\s+[A-Z]\w+\.\s", r"[Tt]he result\?",
               r"\bNo \w+\. No \w+\. Just \w+\.", r"^[A-Z][a-z]+\.$"]
TRI_COLON = [r"\b\w+, \w+, and \w+\b"]

def body_text(path):
    t = open(path, encoding="utf-8").read()
    lines = [l for l in t.splitlines() if not l.strip().startswith(("import","export","<script","const ","\"@","dangerouslySet"))]
    return "\n".join(lines)

for f in sys.argv[1:]:
    t = body_text(f)
    # strip JSX tags for a rough prose count
    prose = re.sub(r"<[^>]+>", " ", t)
    prose = re.sub(r"\{[^{}]*\}", " ", prose)
    words = re.findall(r"[A-Za-z][A-Za-z'\-]+", prose)
    n = len(words)
    print(f"\n=== {f.split('/')[-1]} | ~{n} words ===")
    hits = []
    for w in AI_WORDS:
        c = len(re.findall(re.escape(w), prose, re.I))
        if c: hits.append(f"{w}:{c}")
    print("AI markers:", ", ".join(hits) if hits else "none")
    dashes = prose.count("—")
    print(f"em-dashes: {dashes}  (~1 per {round(n/max(dashes,1))} words; target ~100)")
    for p in FAKE_RHYTHM:
        m = re.findall(p, prose)
        if m: print("fake-rhythm hit:", m[:3])
    tricolons = re.findall(r"\b\w+, \w+, and \w+\b", prose)
    print(f"tricolon-ish phrases: {len(tricolons)} -> {tricolons[:4]}")
