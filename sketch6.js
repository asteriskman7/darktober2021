'use strict';

class Sketch6 extends Sketch {
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

  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'hsl(37, 58%, 69%)';
    ctx.fillRect(0, 0, width, height);
    const noiseConfig = [
      {a: 15, s: 1/2},
      {a: 5, s: 1/100}
    ];

    ctx.translate(width/2, height/2);
    ctx.strokeStyle = 'hsl(21, 26%, 25%)';
    ctx.lineCap = 'square';
    const dtheta = 1/1000;
    const sx = 150;
    const sy = 0;
    let lastx = sx;
    let lasty = sy;
    for (let theta = 0; theta <= 1; theta += dtheta) {
      let x;
      let y;
      let tscale;
      if (theta < 0.5) {
        const sr = 150;
        const st = 20.6;
        x = sx + theta * sr * Math.cos(theta * st / 0.5);
        y = sy + theta * sr * Math.sin(theta * st / 0.5);
        tscale = this.lmap(theta, 0, 0.5, 0, 10);
      } else {
        const lx = 140;
        const ly = 74;
        x = this.lmap(theta, 0.5, 1, lx, 0);
        y = ly;
        tscale = 10;
      }
      ctx.beginPath();
      ctx.moveTo(lastx, lasty);
      ctx.lineTo(x, y);
      ctx.moveTo(-lastx, lasty);
      ctx.lineTo(-x, y);
      ctx.lineWidth = 20 * this.fnoise(theta * tscale + t * 2, noiseConfig) + 1;
      ctx.stroke();
      lastx = x;
      lasty = y;
    }
  }
}

app.sketches[6] = new Sketch6();
app.sketches[6].desc = `I mustache you a question: are you feeling sleepy?`;
