'use strict';

class Sketch28 extends Sketch {
  constructor() {
    super();
  }


  load() {
    super.load();
  }

  update() {
  }

  draw(ctx, width, height, t, mousePoint) {
    const sh = this.lmap(Math.sin(t * 1), -1, 1, 0, 1);

    //sky
    ctx.fillStyle = 'hsl(237, 23%, 17%)';
    ctx.fillRect(0, 0, width, height);

    //stars
    for (let i = 0; i < 100; i++) {
      const sx = this.rnd(i * 10 + 10) * width + 2 * Math.sin(t * 100 + i * 100) * sh;
      const sy = this.rnd(i * 20 + 20) * height;
      const shue = this.rnd(i * 30 + 30) * 360;
      const sl = this.lmap(Math.sin(t * 5 * this.rnd(i * 40 + 40) + 50 * this.rnd(i * 50 + 50)), -1, 1, 40, 90);
      ctx.fillStyle = `hsl(${shue}, 30%, ${sl}%)`;
      ctx.fillRect(sx, sy, 1, 1);
    }

    //water bg
    ctx.fillStyle = 'hsl(211, 42%, 39%)';
    ctx.fillRect(0, 200, width, height - 200);

    //disturbance
    ctx.fillStyle = 'hsl(123, 67%, 20%)';
    for (let i = 0; i < 50; i++) {
      const dx = 256 + 70 * Math.sin(t * this.rnd(i * 10 + 10) * 2 + 100 * this.rnd(i * 100 + 100));
      const dy = 270 + 5 * Math.sin(t * this.rnd(i * 20 + 20) + 100 * this.rnd(i * 200 + 200)) - sh * 20;
      const dr = 10 + 10 * this.rnd(i * 30 + 30);
      ctx.beginPath();
      ctx.arc(dx, dy, dr, 0, 2 * Math.PI);
      ctx.fill();
    }

    //water fg
    ctx.fillStyle = 'hsl(211, 42%, 39%)';
    ctx.fillRect(0, 250, width, height - 200);

    //foam
    const fn = this.lmap(sh, 0, 1, 5, 90);
    for (let i = 0; i < fn; i++) {
      ctx.fillStyle = `hsl(211, 42%, ${this.lmap(Math.random(), 0, 1, 40, 80)}%)`;
      const fx = this.lmap(Math.random(), 0, 1, 256 - 90, 256 + 90);
      const fy = 250;
      ctx.fillRect(fx, fy, 3, 3);
    }

    //land
    ctx.fillStyle = 'hsl(128, 30%, 19%)';
    ctx.fillRect(0, 300, width, height - 300);

    //altar
    ctx.translate(width / 2, 0);
    ctx.fillStyle = 'hsl(0, 0%, 43%)';
    ctx.strokeStyle = 'hsl(0, 0%, 28%)';
    const awidth = 70;
    ctx.fillRect(- awidth / 2, 320, awidth, 15);
    ctx.strokeRect(- awidth / 2, 320, awidth, 15);
    ctx.fillRect(- awidth * 0.4, 335, 15, 15);
    ctx.strokeRect(- awidth * 0.4, 335, 15, 15);
    ctx.fillRect(awidth * 0.4 - 15, 335, 15, 15);
    ctx.strokeRect(awidth * 0.4 - 15, 335, 15, 15);

    //sacrifice
    ctx.fillStyle = 'hsl(128, 0%, 80%)';
    const sx = -awidth * 0.35 + 2 * sh * Math.sin(t * 100);
    const sy = this.lmap(sh, 0, 1, 310, 305);
    ctx.fillRect(sx, sy, awidth * 0.75, 10);

    //fire
    const fy = 400;
    ctx.fillStyle = `hsl(${10 * Math.random()}, 88%, ${45 + 10 * Math.random()}%)`;
    ctx.fillRect(-20, fy, 40, 40);
    ctx.fillStyle = `hsl(24, 88%, ${45 + 10 * Math.random()}%)`;
    ctx.fillRect(-15, fy + 10, 30, 30);
    ctx.fillStyle = `hsl(54, 88%, ${40 + 20 * Math.random()}%)`;
    ctx.fillRect(-10, fy + 20, 20, 20);

    //members
    ctx.fillStyle = 'hsl(266, 67%, 28%)';
    const mw = 10;
    const mh = 50;
    for (let s = -1; s <= 1; s += 2) {
      for (let i = 0; i < 3; i++) {
        const mx = s * (150 - i * 40);
        const my = 360 + i * 40 - 3 * Math.sin(t * 4 + 10 * this.rnd(i + 10));
        ctx.fillRect(mx - mw / 2, my - mh / 2, mw, mh);
      }
    }
  }
}

app.sketches[28] = new Sketch28();
app.sketches[28].desc = ``;
