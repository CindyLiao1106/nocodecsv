#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""阶段 B:落盘(备份)→ 返回结果给下一步构建"""
import json, os, shutil, datetime

ROOT = '/opt/data/cad_work/nocodecsv_workspace'
BAK = '/opt/data/backups/nocodecsv_pre_stageB_' + datetime.datetime.now().strftime('%Y%m%d_%H%M')
os.makedirs(BAK, exist_ok=True)

files = json.load(open('/tmp/stageB_files.json', encoding='utf-8'))

def strip_fence(c):
    lines = c.strip('\n').split('\n')
    if lines and lines[0].strip().startswith('```'): lines = lines[1:]
    if lines and lines[-1].strip().startswith('```'): lines = lines[:-1]
    return '\n'.join(lines).rstrip() + '\n'

for f in files:
    rel, content = f['path'], strip_fence(f['content'])
    dst = os.path.join(ROOT, rel)
    if os.path.exists(dst):
        shutil.copy2(dst, os.path.join(BAK, rel.replace('/', '__')))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'w', encoding='utf-8').write(content)
    print(f"  {'(改)' if os.path.exists(os.path.join(BAK, rel.replace('/', '__'))) else '(新)'} {rel}")

print(f"\n  备份: {BAK}")

# 关键验收
import subprocess
print("\n  === 验收 ===")
n = subprocess.run(['grep', '-rc', 'ca-pub-4847137398088537', f'{ROOT}/src'],
                   capture_output=True, text=True).stdout.strip().split('\n')
hits = [l for l in n if not l.endswith(':0')]
print(f"  AdSense ID 出现在: {len(hits)} 个文件")
for h in hits:
    print(f"    {h.replace(ROOT + '/', '')}")
