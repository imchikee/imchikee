"""Capture the local B candidate offline; never publish or upload anything."""

import os
from pathlib import Path
import subprocess
import tempfile

from PIL import Image

ROOT = Path(__file__).resolve().parent

for name,theme,width,height in [('light','light',1440,1680),('dark','dark',1440,1680),('mobile','light',430,1800)]:
    with tempfile.TemporaryDirectory(prefix='profile-b-firefox-') as profile:
        Path(profile,'user.js').write_text('user_pref("network.offline", true);\nuser_pref("toolkit.telemetry.enabled", false);\n')
        cmd = ['firefox','--headless','--no-remote','--profile',profile,
               '--window-size',f'{width},{height}','--screenshot',str(ROOT/f'preview-{name}.png'),
               (ROOT/f'preview-{theme}.html').as_uri()]
        result = subprocess.run(cmd,env={**os.environ,'MOZ_CRASHREPORTER_DISABLE':'1'},capture_output=True,text=True,timeout=40)
        if result.returncode:
            raise RuntimeError(result.stderr)
        print(f'B/{name}: saved',flush=True)

for theme,suffix in [('light',''),('dark','-dark')]:
    Image.open(ROOT/f'preview-{theme}.png').crop((370,140,1334,1434)).save(ROOT/f'preview-readme{suffix}.png')
