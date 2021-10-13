'use strict';

class Sketch14 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  load() {
    super.load();
    this.p = [];
    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const r = 50 * (Math.random() + Math.random());
      this.p.push({
        theta,
        r,
        i
      });
    }
  }

  update() {
  }


  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);

    ctx.fillStyle = 'blue';
    this.p.forEach( p => {
      ctx.fillStyle = `hsl(${this.lmap(p.i, 0, this.p.length, 180, 280 )}, 100%, 50%)`;
      const theta = p.theta + t * 0.2 + 0.00 * Math.sin(t * 200 + 17 * this.rnd(p.i * 17) ) ;
      const r = this.lmap(t, 0, 10, p.r, -25) + 25 * Math.sin(t * t + 7 * this.rnd(p.i * 7));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      ctx.fillRect(x, y, 3, 3);
    });

    if (t > 100) {
      this.load();
    }
  }
}

app.sketches[14] = new Sketch14();
app.sketches[14].desc = `Sometimes we must look deep within ourselves to understand what is going on around us.`;
