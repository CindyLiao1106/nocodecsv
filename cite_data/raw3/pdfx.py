
import fitz, sys
path=sys.argv[1]; out=sys.argv[2]
d=fitz.open(path)
t="\n".join(p.get_text() for p in d)
open(out,"w",encoding="utf-8").write(t)
print("pages",len(d),"chars",len(t))
