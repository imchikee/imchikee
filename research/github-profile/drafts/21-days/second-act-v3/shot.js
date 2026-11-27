'use strict';

window.createSecondActV3Shot = function (canvas, assetBase) {
  const {width, height, columns, frameTiles, durationsMs} = window.SECOND_ACT_V3_FRAMES;
  const ctx = canvas.getContext('2d');

  let endMs = 0;
  const frameEnds = durationsMs.map(duration => endMs += duration);
  const atlas = new Image();
  atlas.src = assetBase + 'frames-hd.webp';
  let loaded = false;
  const ready = atlas.decode().then(() => { loaded = true; });

  function frameIndex(localTime) {
    // Account for floating-point subtraction at chapter and GIF boundaries.
    const ms = (Number.isFinite(localTime) ? localTime : 0) * 1000 + 1e-7;
    const index = frameEnds.findIndex(end => ms < end);
    return index === -1 ? frameEnds.length - 1 : index;
  }

  function draw(localTime) {
    if (!loaded) return;
    const tile = frameTiles[frameIndex(localTime)];
    // Tiles were already cropped and resampled at the stage's backing resolution.
    const x = (tile % columns) * width;
    const y = Math.floor(tile / columns) * height;
    ctx.drawImage(atlas, x, y, width, height, 0, 0, width, height);
  }

  return {draw, ready, frameIndex};
};
