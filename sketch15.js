'use strict';

class Sketch15 extends Sketch {
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

  drawSpike(ctx, t, minR, maxR, count, thickness, h, fill=true) {
    ctx.beginPath();
    const da = Math.PI * 2 / count;
    ctx.lineWidth = thickness; 
    for (let a = 0; a < Math.PI * 2; a += da) {
      const rb = minR;
      const o = t * 7 ;
      const r = this.lmap(this.rnd(t * minR + a), 0, 1, minR, maxR);
      ctx.moveTo(rb * Math.cos(a + o), rb * Math.sin(a + o));
      ctx.lineTo(r* Math.cos(a + da/2 + o), r * Math.sin(a + da/2 + o));
      ctx.lineTo(rb * Math.cos(a + da + o), rb * Math.sin(a + da + o));
    }
    if (fill) {
      ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
      ctx.fill();
      this.drawSpike(ctx, t, minR, maxR, count, thickness, h, false);
    } else {
      ctx.strokeStyle = 'black';
      ctx.stroke();
    }
  }

  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = `hsl(${this.lmap(Math.sin(t),-1, 1, 0, 60)}, 50%, 50%)`;
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);

    for (let i = 6; i >= 0; i--) { 
      const minR = i * 10;
      const maxR = i * 40 + 40;
      const count = this.lmap(i, 6, 0, 16, 32);
      const thickness = i;
      const h = this.lmap(i, 6, 0, 0, 120);
      this.drawSpike(ctx, t, minR, maxR, count, thickness, h);
    }
  }
}

app.sketches[15] = new Sketch15();
app.sketches[15].desc = `Owie!`;
