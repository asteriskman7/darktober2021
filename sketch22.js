'use strict';

class Sketch22 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
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
    ctx.fillStyle = `hsl(214, 60%, 27%)`;
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width / 2 , height / 2);

    const img = ctx.getImageData(0, 0, width, height);
    const data = img.data;

    for (let x = 0; x < width; x++) {
      const u = x / width;
      for (let y = 0; y < height; y++) {
        const v = y / height;
        const i = (x + y * width) * 4;

        const d1 = Math.sqrt((u - 0.25) * (u - 0.25) + (v - 0.25) * (v - 0.25));
        const d2 = Math.sqrt((u - 0.75) * (u - 0.75) + (v - 0.25) * (v - 0.25));
        const p1 = {x: 0.25, y: 0.75};
        const p2 = {x: 0.75, y: 0.75};
        const d3 = (Math.abs(
          (p2.x - p1.x) * (p1.y - v) - (p1.x - u) * (p2.y - p1.y)
        ))
          /
          (Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)));


        const d = Math.min(d3, Math.min(d1, d2));


        const h = (this.lmap(Math.sin(t * 0.1), 1, -1, 30, 2055)) * d * 360;
        const s = 100 * (x ^ y) / 128;
        const l = ( d * 3) * 100;

        const rgb = this.hslToRgb(h, s, l);
        data[i + 0] = rgb.r;
        data[i + 1] = rgb.g;
        data[i + 2] = rgb.b;
      }
    }

    ctx.putImageData(img, 0, 0);

  }

}

app.sketches[22] = new Sketch22();
app.sketches[22].desc = `This mask has no point.`;
