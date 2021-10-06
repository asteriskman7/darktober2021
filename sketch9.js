'use strict';

class Sketch9 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
    this.cx = -0.56218;
    this.cy = -0.6428;
    this.size = 0.004722366482869652;
    this.frames = [];
    this.frameIndex = 0;
  }

  load() {
    super.load();
  }

  update() {
  }

  //from https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
  //modified to expect s & l from 0 to 100 instead of 0 to 1 and accept h > 360
  hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    h %= 360;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let hp = h / 60.0;
    let x = c * (1 - Math.abs((hp % 2) - 1));
    let rgb1;
    if (isNaN(h)) rgb1 = [0, 0, 0];
    else if (hp <= 1) rgb1 = [c, x, 0];
    else if (hp <= 2) rgb1 = [x, c, 0];
    else if (hp <= 3) rgb1 = [0, c, x];
    else if (hp <= 4) rgb1 = [0, x, c];
    else if (hp <= 5) rgb1 = [x, 0, c];
    else if (hp <= 6) rgb1 = [c, 0, x];
    let m = l - c * 0.5;
    return {
      r: Math.round(255 * (rgb1[0] + m)),
      g: Math.round(255 * (rgb1[1] + m)),
      b: Math.round(255 * (rgb1[2] + m))
    };
  }

  draw(ctx, width, height, t, mousePoint) {
    const maxFrameSeconds = 1;
    const maxFrameCount = 30 * maxFrameSeconds;
    if (this.frames.length < maxFrameCount) {
      const maxIter = 100;
      const cx = this.cx;
      const cy = this.cy;
      const size = this.size;
      const minx = cx - size / 2;
      const maxx = cx + size / 2;
      const miny = cy - size / 2;
      const maxy = cy + size / 2;
      const imageData = this.ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let x = 0; x < this.width; x++) {
        const u = x / this.width;
        for (let y = 0; y < this.height; y++) {
          const v = y / this.height;

          let cr = minx + (maxx - minx) * u;
          let ci = miny + (maxy - miny) * v;
          let zr = 0;
          let zi = 0;
          let inSet = true;
          let i;
          for (i = 0; i < maxIter; i++) {
            //z = z ^ 2 + c
            [zr, zi] = [zr * zr - zi * zi + cr, 2 * zr * zi + ci];
            const d2 = zr * zr + zi * zi;
            if (d2 >= 4) {
              inSet = false;
              break;
            }
          }

          const dataIndex = (x + y * width) * 4;
          const color = this.hslToRgb(this.lmap(this.frames.length, 0, maxFrameCount, 360, 0) + 360 * i / maxIter, 100, 70);
          data[dataIndex + 0] = color.r; //(255 * i / maxIter + t * 10) & 0xFF;
          data[dataIndex + 1] = color.g;
          data[dataIndex + 2] = color.b;
          data[dataIndex + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const newCanvas = document.createElement('canvas');
      newCanvas.width = width;
      newCanvas.height = height;
      const newCtx = newCanvas.getContext('2d');
      newCtx.drawImage(this.canvas, 0, 0);
      this.frames.push(newCanvas);

      ctx.font = '30px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('Generating...', 10, 30);
    } else {
      this.ctx.drawImage(this.frames[this.frameIndex], 0, 0);
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }
  }
}

app.sketches[9] = new Sketch9();
app.sketches[9].desc = `Delving into the Mandelbrot set can be a mind altering experience.`;
