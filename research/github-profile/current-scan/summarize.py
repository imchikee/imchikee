from pathlib import Path
import json
import re
import sys

root = Path(__file__).resolve().parent
rows = json.loads((root / 'source-results.json').read_text())['records']
for row in rows[int(sys.argv[1])-1:int(sys.argv[2])]:
    text = row.get('text', '')
    clean = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    plain = re.sub('<[^>]+>', ' ', clean)
    plain = re.sub(r'\s+', ' ', plain)
    headings = re.findall(r'(?m)^#{1,4} (.+)$', clean)
    headings += re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', clean, flags=re.S)
    imgs = re.findall(r'(?:src\s*=\s*[\"\']([^\"\']+)|!\[[^\]]*\]\(([^)]+)\))', clean)
    print(json.dumps(dict(id=row['id'], name=row['name'], status=row['status'],
        intro=plain[:450], end=plain[-160:] if len(plain)>650 else '',
        sections=[re.sub('<[^>]+>', '', x) for x in headings][:10],
        images=len(imgs), first_images=[a or b for a,b in imgs][:2],
        details=clean.count('<details'), picture=clean.count('<picture')),
        ensure_ascii=False))
