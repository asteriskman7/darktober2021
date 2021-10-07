'use strict';

class Sketch7 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  load() {
    super.load();
    this.ss = [];
  }

  update() {
    if (Math.random() > 0.95) {
      const startAngle = Math.random() * 2 * Math.PI;
      //const travelAngle = startAngle + (Math.random() > 0.5 ? 1 : -1) * 3 * Math.PI / 2;
      const travelAngle = Math.random() * 2 * Math.PI;
      const outsideRadius = 370;
      const speed = 10;
      this.ss.push({
        x: outsideRadius * Math.cos(startAngle),
        y: outsideRadius * Math.sin(startAngle),
        a: travelAngle,
        s: speed
      });
    }

    this.ss.forEach( ss => {
      ss.x += ss.s * Math.cos(ss.a);
      ss.y += ss.s * Math.sin(ss.a);
    });

    this.ss = this.ss.filter( ss => {
      return ss.x > -400 && ss.x < 400 && ss.y > -400 && ss.y < 400;
    });
  }

  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'hsl(224, 66%, 30%)';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width/2, height/2);

    //create sun
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'bevel';
    const rsun = 35;
    const dtheta = Math.PI * 2 / 24;
    for (let theta = 0; theta <= Math.PI * 2; theta += dtheta) {
      const t2 = theta - t / 4;
      const x0 = rsun * Math.cos(t2 - dtheta / 2);
      const y0 = rsun * Math.sin(t2 - dtheta / 2);
      const pr = 80 + 20 * Math.sin(t2 * 8 + t * 3.3);
      const x1 = pr * Math.cos(t2);
      const y1 = pr * Math.sin(t2);
      const x2 = rsun * Math.cos(t2 + dtheta / 2);
      const y2 = rsun * Math.sin(t2 + dtheta / 2);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    //create stars
    ctx.fillStyle = 'yellow';
    for (let i = 0; i < 300; i++) {
      const l = this.lmap(Math.sin(t * 2 + 100 * this.rnd(i+11)), -1, 1, 0, 100);
      ctx.fillStyle = `hsla(60, 100%, ${l}%, ${l/100})`;
      const r = 250 * this.rnd(i+23) + 120;
      const theta = Math.PI * 2 * this.rnd(i*2+11);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      ctx.fillRect(x, y, 2, 2);
      ctx.fillRect(x, y, 2, 2);

    }

    //draw shooting stars
    this.ss.forEach(ss => {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(ss.x, ss.y, 5, 5);
    });

    //draw concentric circles
    for (let i = 0; i < 10; i++) {
      const r = 120 + 250 * this.rnd(i + 45);
      ctx.strokeStyle = `hsla(60, 100%, 100%, 0.2)`;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

app.sketches[7] = new Sketch7();
app.sketches[7].desc = `What do the stars say about your future? (Hint: nothing)`;
