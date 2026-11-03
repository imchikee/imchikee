"""Capture the six local preview pages using the installed Firefox."""

import os
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent

for variant in ['A','C']:
    for name,theme,width,height in [('light','light',1440,1770),('dark','dark',1440,1770),('mobile','light',430,1840)]:
        with tempfile.TemporaryDirectory(prefix='profile-ac-firefox-') as profile:
            Path(profile,'user.js').write_text('user_pref("network.offline", true);\nuser_pref("toolkit.telemetry.enabled", false);\n')
            cmd = ['firefox','--headless','--no-remote','--profile',profile,
                   '--window-size',f'{width},{height}','--screenshot',str(ROOT/variant/f'preview-{name}.png'),
                   (ROOT/variant/f'preview-{theme}.html').as_uri()]
            result = subprocess.run(cmd,env={**os.environ,'MOZ_CRASHREPORTER_DISABLE':'1'},capture_output=True,text=True,timeout=40)
            if result.returncode:
                raise RuntimeError(result.stderr)
            print(f'{variant}/{name}: saved',flush=True)
