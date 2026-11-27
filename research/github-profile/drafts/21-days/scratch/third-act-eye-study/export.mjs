import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const profile = await mkdtemp(path.join(tmpdir(), 'third-eye-chrome-'));
const browser = spawn(process.env.PROFILE_CHROME || '/opt/google/chrome/chrome', [
  '--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--disable-component-update', '--disable-sync',
  '--disable-extensions', '--disable-crash-reporter',
  '--host-resolver-rules=MAP * ~NOTFOUND',
  '--allow-file-access-from-files', '--remote-debugging-pipe',
  '--user-data-dir=' + profile, 'about:blank',
], {stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe']});

let sequence = 0;
let buffer = '';
let stderr = '';
const pending = new Map();
browser.stderr.on('data', part => { stderr = (stderr + part).slice(-3000); });
browser.stdio[3].on('error', () => {});
browser.on('exit', code => {
  for (const receiver of pending.values()) receiver.reject(new Error('Chrome exit ' + code + ': ' + stderr));
});

function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error('CDP timeout ' + method + ': ' + stderr));
    }, 20000);
    pending.set(id, {
      resolve(value) { clearTimeout(timer); resolve(value); },
      reject(error) { clearTimeout(timer); reject(error); },
    });
    browser.stdio[3].write(JSON.stringify({id, method, params, sessionId}) + '\0');
  });
}

browser.stdio[4].setEncoding('utf8').on('data', part => {
  buffer += part;
  let end;
  while ((end = buffer.indexOf('\0')) !== -1) {
    const message = JSON.parse(buffer.slice(0, end));
    buffer = buffer.slice(end + 1);
    const receiver = pending.get(message.id);
    if (!receiver) continue;
    pending.delete(message.id);
    if (message.error) receiver.reject(new Error(JSON.stringify(message.error)));
    else receiver.resolve(message.result);
  }
});

function png(dataURL) {
  return Buffer.from(dataURL.split(',')[1], 'base64');
}

async function writePreview(buffers, changes) {
  const process = spawn('ffmpeg', [
    '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-i', 'pipe:0',
    '-an', '-c:v', 'apng', '-pix_fmt', 'rgb24', '-plays', '1',
    '-final_delay', '1/30', '-f', 'apng', path.join(root, 'preview.png'),
  ], {stdio: ['pipe', 'inherit', 'inherit']});
  try {
    const done = once(process, 'close');
    process.stdin.on('error', () => {});
    for (let n = 0; n < changes.length; n++) {
      if (!process.stdin.write(buffers.get(changes[n] ? n : 0))) {
        await Promise.race([once(process.stdin, 'drain'), done.then(() => { throw new Error('FFmpeg stopped early'); })]);
      }
    }
    process.stdin.end();
    const [code] = await done;
    assert.equal(code, 0, 'FFmpeg export');
  } finally {
    if (process.exitCode === null) process.kill();
  }
}

try {
  const {targetId} = await send('Target.createTarget', {url: 'about:blank'});
  const {sessionId} = await send('Target.attachToTarget', {targetId, flatten: true});
  const call = (method, params) => send(method, params, sessionId);
  async function evaluate(expression) {
    const data = await call('Runtime.evaluate', {expression, awaitPromise: true, returnByValue: true});
    if (data.exceptionDetails) throw new Error(data.exceptionDetails.exception?.description || data.exceptionDetails.text);
    return data.result.value;
  }

  await call('Page.enable', {});
  await call('Network.enable', {});
  await call('Network.setBlockedURLs', {urls: ['http://*', 'https://*']});
  await call('Emulation.setDeviceMetricsOverride', {width: 980, height: 780, deviceScaleFactor: 1, mobile: false});
  await call('Page.navigate', {url: pathToFileURL(path.join(root, 'index.html')).href});
  for (let i = 0; i < 60 && !await evaluate('Boolean(window.thirdActEyeStudy)'); i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  await evaluate('thirdActEyeStudy.ready.then(() => true)');

  // Source-space eye regions, well inside the eyebrows and whiskers.
  const changes = await evaluate('(' + (() => {
    const {draw, canvas} = thirdActEyeStudy;
    const ctx = canvas.getContext('2d');
    const {width, height} = canvas;
    const boxes = [[692, 588, 773, 661], [865, 577, 937, 650]];
    draw(0);
    const base = ctx.getImageData(0, 0, width, height).data;
    return Array.from({length: 117}, (_, frame) => {
      draw(frame / 30);
      const next = ctx.getImageData(0, 0, width, height).data;
      let changed = 0;
      for (let i = 0; i < base.length; i += 4) {
        if (base[i] === next[i] && base[i+1] === next[i+1] && base[i+2] === next[i+2]) continue;
        changed++;
        const pixel = i / 4;
        const x = pixel % width;
        const y = Math.floor(pixel / width);
        if (!boxes.some(([l,t,r,b]) => x >= l && x < r && y >= t && y < b)) {
          throw new Error('Frame ' + frame + ' changes a fixed pixel at ' + x + ', ' + y);
        }
      }
      return changed;
    });
  }).toString() + ')()');

  assert.ok(changes[46] > 0 && changes[63] > 0, 'Closed and glance poses are visible');
  assert.equal(changes[52], 0, 'Exact recovery following the blink');
  assert.ok(changes.every((count, index) => !count || (index / 30 >= 1.25 && index / 30 < 2.45)));
  assert.equal(changes.length, 117);
  const buffers = new Map();
  for (let n = 0; n < changes.length; n++) {
    if (n !== 0 && !changes[n]) continue;
    const bitmap = await evaluate('thirdActEyeStudy.draw(' + n + '/30); thirdActEyeStudy.canvas.toDataURL()');
    buffers.set(n, png(bitmap));
  }
  await writeFile(path.join(root, 'first.png'), buffers.get(0));
  await writeFile(path.join(root, 'closed.png'), buffers.get(46));
  const restored = await evaluate('thirdActEyeStudy.draw(74/30); thirdActEyeStudy.canvas.toDataURL()');
  await writeFile(path.join(root, 'restored.png'), png(restored));
  await writePreview(buffers, changes);

  // Capture samples during real-time playback with the Canvas displayed 534 px wide.
  const observed = await evaluate('(' + (async () => {
    const {draw, canvas} = thirdActEyeStudy;
    const button = document.getElementById('play');
    const targets = [.15, 1.45, 1.53, 1.63, 1.75, 2.10, 2.65, 3.85];
    const capture = document.createElement('canvas');
    capture.width = 1068;
    capture.height = 4 * 464;
    const painter = capture.getContext('2d');
    const times = [];
    draw(0);
    button.click();
    const started = performance.now();
    await new Promise((resolve, reject) => {
      function sample() {
        const elapsed = thirdActEyeStudy.time;
        const i = times.length;
        if (i < targets.length && elapsed >= targets[i]) {
          const x = (i % 2) * 534;
          const y = Math.floor(i / 2) * 464;
          painter.drawImage(canvas, x, y, 534, 441);
          painter.fillStyle = '#172026';
          painter.fillRect(x, y + 441, 534, 23);
          painter.fillStyle = 'white';
          painter.font = '13px sans-serif';
          painter.fillText(elapsed.toFixed(3) + ' s', x + 6, y + 457);
          times.push(elapsed);
        }
        if (button.textContent === '重播') resolve();
        else if (performance.now() - started > 5500) reject(new Error('Real-time playback did not finish'));
        else requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });
    return {times, final: thirdActEyeStudy.time, width: canvas.getBoundingClientRect().width, png: capture.toDataURL()};
  }).toString() + ')()');
  assert.equal(observed.width, 534);
  assert.equal(observed.final, 3.9);
  assert.equal(observed.times.length, 8);
  // The review contact sheet is optional, and can be stored outside the project.
  if (process.argv[2]) await writeFile(process.argv[2], png(observed.png));
  console.log(JSON.stringify({
    framesChecked: changes.length, outsideEyePixels: 0, restoredAtFrame: 52,
    activeFrames: changes.flatMap((count, n) => count ? [n] : []),
    maxChangedPixels: Math.max(...changes), sampledPlaybackTimes: observed.times,
    displayedWidth: observed.width, playbackEnd: observed.final,
  }, null, 2));
} finally {
  if (browser.exitCode === null && browser.signalCode === null) {
    const exited = once(browser, 'exit');
    await send('Browser.close').catch(() => browser.kill());
    await exited;
  }
  await rm(profile, {recursive: true, force: true, maxRetries: 3});
}
