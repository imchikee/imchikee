'use strict';

window.createBuildingShot = function (canvas, assetBase) {
  const atlas = window.BUILDING_ATLAS;
  const ctx = canvas.getContext('2d');
  const duration = atlas ? atlas.duration : 3.9;
  const sw = atlas ? atlas.width : 1380;
  const sh = atlas ? atlas.height : 1140;
  const fps = atlas ? atlas.fps : 30;
  const frames = atlas ? atlas.frames : 117;

  const buffer = document.createElement('canvas');
  buffer.width = sw;
  buffer.height = sh;
  const bctx = buffer.getContext('2d', { alpha: false });

  const framed = document.createElement('canvas');
  const framedCtx = framed.getContext('2d', { alpha: false });

  let base = null;
  let patches = null;
  let loaded = false;

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const finish = () => {
        if (image.decode) {
          image.decode().then(() => resolve(image)).catch(() => resolve(image));
        } else {
          resolve(image);
        }
      };
      image.onload = finish;
      image.onerror = () => reject(new Error('Building scene artwork failed to load: ' + src));
      image.src = assetBase + src;
    });
  }

  function frameIndex(localTime) {
    const t = Math.max(0, Math.min(duration, Number.isFinite(localTime) ? localTime : 0));
    return Math.min(frames - 1, Math.floor(t * fps + 1e-8));
  }

  function composeNative(index) {
    const [pawX, pawY, pawW, pawH] = atlas.pawBox;
    const [eyeX, eyeY, eyeW, eyeH] = atlas.eyeBox;
    bctx.drawImage(base, 0, 0);
    const pawIdx = atlas.pawFrames[index];
    if (pawIdx >= 0) {
      const [sx, sy] = atlas.pawTiles[pawIdx];
      bctx.drawImage(patches, sx, sy, pawW, pawH, pawX, pawY, pawW, pawH);
    }
    const eyeIdx = atlas.eyeFrames[index];
    if (eyeIdx >= 0) {
      const [sx, sy] = atlas.eyeTiles[eyeIdx];
      bctx.drawImage(patches, sx, sy, eyeW, eyeH, eyeX, eyeY, eyeW, eyeH);
    }
  }

  function draw(localTime) {
    if (!loaded) return;
    composeNative(frameIndex(localTime));
    // Anchor the native animation to the top. The extra artwork sits below it.
    framedCtx.drawImage(buffer, 0, 0);
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / framed.width, ch / framed.height);
    const cropWidth = cw / scale;
    const cropHeight = ch / scale;
    const cropLeft = (framed.width - cropWidth) / 2;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(framed, cropLeft, 0, cropWidth, cropHeight, 0, 0, cw, ch);
    ctx.restore();
  }

  const ready = atlas
    ? Promise.all([loadImage('p0.png'), loadImage('patches.png'), loadImage('p0-extended.png')]).then(images => {
        const extension = images[2];
        [base, patches] = images;
        framed.width = extension.naturalWidth;
        framed.height = extension.naturalHeight;
        framedCtx.drawImage(extension, 0, 0);
        loaded = true;
      }).catch(error => {
        canvas.dataset.error = 'Building artwork failed to load';
        throw error;
      })
    : Promise.reject(new Error('BUILDING_ATLAS not loaded'));

  return {
    draw,
    ready,
    get loaded() {
      return loaded;
    },
    duration,
    frameIndex,
    composeNative,
    get buffer() {
      return buffer;
    },
  };
};
