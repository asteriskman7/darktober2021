'use strict';

class Sketch21 extends Sketch {
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
    ctx.fillStyle = `hsl(214, 60%, 27%)`;
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width / 2 , height / 2);

    ctx.fillStyle = 'black';
    ctx.font = 'bold 50px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('The', 0, -210);
    ctx.fillText('******', 0, -160);
    ctx.fillText('Box', 0, -120);

    ctx.fillStyle = 'hsl(31, 60%, 18%)';
    ctx.fillRect(-256, 100, width, height);

    //box back
    ctx.fillStyle = 'hsl(21, 60%, 28%)';
    ctx.fillRect(-100, -50, 200, 250);

    //top/bottom
    ctx.strokeStyle = 'hsl(21, 60%, 40%)';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(-100, -50);
    ctx.lineTo(100, -50);
    ctx.moveTo(-100, 200);
    ctx.lineTo(100, 200);
    ctx.stroke();

    const openF = this.lmap(Math.sin(t * Math.tan(t)), -1, 1, 0.1, 1);
    //const openF = this.lmap(Math.sin(t *1), -1, 1, 0.0, 1);
    const curseTheta = this.lmap(openF, 0.1, 1, 0, 6.28);

    //inside curse
    for (let i = 0; i < 50; i++) {
      const h = this.lmap(this.rnd(i * 11 + 4), 0, 1, 250, 275);
      ctx.fillStyle = `hsla(${h}, 82%, 28%, ${openF})`;
      const r1 = this.lmap(this.rnd(i * 22 + 5), 0, 1, 5, 20);
      const cx = this.lmap(this.rnd(i * 33 + 6), 0, 1, -55, 55);
      const cy = this.lmap(this.rnd(i * 44 + 7), 0, 1, -40, 190);
      const r2 = this.lmap(this.rnd(i * 55 + 8), 0, 1, 10, 30);
      const da = this.lmap(this.rnd(i * 66 + 9), 0, 1, 0, 6.28);
      const rate = this.lmap(this.rnd(i * 77 + 10), 0, 1, 1, 5);
      const x = cx + r2 * Math.cos(curseTheta * rate + da);
      const y = cy + r2 * Math.sin(curseTheta * rate + da);
      ctx.beginPath();
      ctx.arc(x, y, r1, 0, Math.PI * 2);
      ctx.fill();
    }
     
    for (let s = -1; s <= 1; s += 2) {

      //doors
      ctx.fillStyle = 'hsl(21, 60%, 50%)';
      ctx.beginPath();
      ctx.moveTo(s * 100, -50);
      ctx.lineTo(s * 10 * openF, -50 - 20 * openF);
      ctx.lineTo(s * 10 * openF, 200 + 20 * openF);
      ctx.lineTo(s * 100, 200);
      ctx.closePath();
      ctx.fill();

      //pulls
      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(s * 30 + s * 10 * openF, 0, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let s = -1; s <= 1; s += 2) {
      //outside curse
      for (let i = 0; i < 500; i++) {
        const h = this.lmap(this.rnd(i * 10 + 10), 0, 1, 220, 295);
        ctx.fillStyle = `hsla(${h}, 82%, 48%, ${openF})`;
        const x1 = 0;
        const y1 = this.lmap(this.rnd(i * 5 + 5), 0, 1, -50, 200);
        const r = this.lmap(this.rnd(i * 6 + 6), 0, 1, 10, 200);
        const a = this.lmap(this.rnd(i * 7 + 7), 0, 1, 0, Math.PI * 2);
        const x2 = x1 + r * Math.cos(a);
        const y2 = y1 + r * Math.sin(a);
        const x = this.lmap(openF, 0, 1, x1, x2) + 15 * this.rnd(t * i * 9 + 9);
        const y = this.lmap(openF, 0, 1, y1, y2) + 15 * this.rnd(t * i * 10 + 10);
        ctx.fillRect(x, y, 3, 3);
      }
    }
  }
}

app.sketches[21] = new Sketch21();
app.sketches[21].desc = `You must not speak the name of the box!`;
