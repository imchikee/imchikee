"""Capture each current public profile without clicking controls or changing remote state."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json
import subprocess
import time

ROOT = Path(__file__).resolve().parent
profiles = json.loads((ROOT / 'source-results.json').read_text())['records']

def worker(part):
    profile = Path('/tmp') / f'github-profile-current-{part}'
    profile.mkdir(exist_ok=True)
    results = []
    for entry in profiles[part::2]:
        target = ROOT / 'screenshots' / f"{entry['id']:03}-{entry['name']}.png"
        record = dict(id=entry['id'], name=entry['name'], url=f"https://github.com/{entry['name']}")
        try:
            run = subprocess.run([
                'firefox', '--headless', '--no-remote', '--profile', str(profile),
                '--screenshot', str(target), '--window-size', '1440,5000', record['url'],
            ], capture_output=True, timeout=40)
            record.update(saved=target.exists() and run.returncode == 0,
                          exit_code=run.returncode, stderr=run.stderr.decode(errors='replace')[-400:])
        except subprocess.TimeoutExpired:
            record.update(saved=False, error='browser capture timeout')
        record['captured_at'] = time.strftime('%Y-%m-%dT%H:%M:%S%z')
        record['manual_review'] = 'pending'
        results.append(record)
        (ROOT / f'capture-worker-{part}.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
        print(entry['id'], entry['name'], record['saved'], flush=True)
    return results

with ThreadPoolExecutor(max_workers=2) as pool:
    rows = [row for batch in pool.map(worker, range(2)) for row in batch]
rows.sort(key=lambda row: row['id'])
(ROOT / 'captures.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
print('CAPTURED', sum(row['saved'] for row in rows), '/', len(rows), flush=True)
