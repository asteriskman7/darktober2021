'use strict';

class Sketch4_Coffin {
  constructor(p, basex, basey) {
    this.p = p;
    this.basex = basex;
    this.basey = basey;
    this.nextOpen = this.p.rnd(basex * basey) * 5;
    this.open = false;
  }

  update(t) {
    if (t >= this.nextOpen) {
      this.open = true;
    }
  }

  draw(ctx, width, height, t, mousePoint) {
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u26b0\ufe0f', this.basex, this.basey);
    if (this.open) {
      ctx.font = '50px Arial';
      const zx = this.basex;
      const zy = this.basey - 10;
      ctx.fillText('\ud83e\udddf', zx, zy);
      const mouseDist2 = (mousePoint.x - zx) * (mousePoint.x - zx) + (mousePoint.y - zy) * (mousePoint.y - zy);
      if (mouseDist2 < 500) {
        this.open = false;
        this.nextOpen = t + Math.min(5, 200/this.p.score) * this.p.rnd(zx * zy + t);
        this.p.score += 1;
      }
    }
  }
}

class Sketch4 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
    this.score = 0;
  }

  load() {
    super.load();
    this.objects = [];
    const xcount = 5;
    const ycount = 3;
    for (let i = 0; i < xcount * ycount; i++) {
      const x = i % xcount;
      const y = Math.floor(i / xcount);
      const basex = (x + 0.5) * this.width / xcount;
      const basey = this.height - y * this.height * 0.5 / ycount - 30;
      this.objects.push(new Sketch4_Coffin(this, basex, basey, this.width, this.height, 0));
    }

  }

  update() {
    this.objects.forEach( o => {
      o.update(this.t);
    });
  }

  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'hsl(240, 18%, 14%)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, height * 0.4, width, height);

    this.objects.forEach( o => {
      o.draw(ctx, width, height, t, mousePoint);
    });

    for (let i = 0; i < this.score; i++) {
      const x = this.rnd(i + 1) * this.width;
      const y = this.rnd(i * 2 + 1) * this.height * 0.4;
      const color = `hsla(48, 100%, ${20 + 80 * this.rnd(i * 3 + 1)}%, ${0.55 + 0.45 * Math.sin(t * 4 * this.rnd(i * 4 + 2))})`;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 2, 2);
    };
  }
}

app.sketches[4] = new Sketch4();
app.sketches[4].desc = `The mouse is a dangerous weapon.`;
