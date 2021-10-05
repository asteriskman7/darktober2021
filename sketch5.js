'use strict';

class Sketch5 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
    this.score = 0;
  }

  load() {
    super.load();
    this.particles = [];
  }

  update() {
    //create new
    const sourcex = 30;
    const sourcey = 50;
    const sourcer = 20;
    const newCount = 10;
    for (let i = 0; i < newCount; i++) {
      this.particles.push({
        x: sourcex + Math.random() * sourcer * Math.sin(Math.random() * 6.28),
        y: sourcey + Math.random() * sourcer * Math.sin(Math.random() * 6.28),
        vx: 10 + 5 * Math.random(),
        vy: 0
      });
    }
    //simulate
    const gravity = 1;
    this.particles.forEach( p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
    });
    //remove old
    this.particles = this.particles.filter( p => {
      return p.x >= 0 && p.x < this.width && p.y >= 0 && p.y < this.height;
    });
  }

  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'hsl(244, 24%, 17%)';
    ctx.fillRect(0, 0, width, height);

    //draw neck
    const neckSize = 200;
    ctx.fillStyle = 'hsl(35, 74%, 60%)';
    ctx.beginPath();
    ctx.moveTo(neckSize, 0);
    ctx.lineTo(0, neckSize);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'hsl(0, 100%, 37%)';
    ctx.beginPath();
    ctx.arc(30, 50, 40, 0, 2 * Math.PI);
    ctx.fill();


    //draw blood
    const pr = 40;
    const pi2 = Math.PI * 2;
    const color1 = "hsla(0, 100%, 45%, 0.8)";
    const color2 = "rgba(255, 0, 0, 0)";

    this.particles.forEach( p => {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pr);
      g.addColorStop(0, color1);
      g.addColorStop(1, color2);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, pr, 0, pi2);
      ctx.fill();
    });

    //draw vampire
    ctx.beginPath();
    ctx.moveTo(width, 300);
    ctx.lineTo(448, 335);
    ctx.lineTo(444, 497);
    ctx.lineTo(276, 460);
    ctx.lineTo(200, height);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = 'hsl(186, 100%, 77%)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(448, 335);
    ctx.lineTo(412, 368);
    ctx.lineTo(448, 356);
    ctx.closePath();
    const gtt = ctx.createRadialGradient(412, 368, 0, 412, 368, 30);
    gtt.addColorStop(0, 'red');
    gtt.addColorStop(1, 'white');
    ctx.fillStyle = gtt;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(276, 460);
    ctx.lineTo(323, 440);
    ctx.lineTo(297, 465);
    ctx.closePath();
    const gtb = ctx.createRadialGradient(323, 440, 0, 323, 440, 30);
    gtb.addColorStop(0, 'red');
    gtb.addColorStop(1, 'white');
    ctx.fillStyle = gtb;
    ctx.fill();

  }
}

app.sketches[5] = new Sketch5();
app.sketches[5].desc = `The appetite of the undead is insatiable.`;
