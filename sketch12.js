'use strict';

class Sketch12 extends Sketch {
  constructor() {
    super();
    this.scale = 16;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  load() {
    super.load();
    this.seeds = [];
    this.seeds.push({
      x: 255,
      y: 0,
      vx: 0,
      vy: 0,
      h: 0,
      targetHeight: 400,
      alive: true
    });
    this.mushrooms = [];
  }

  update() {
    const gravity = 0.1;
    this.seeds.forEach( s => {
      s.vy += gravity;  
      s.x += s.vx;
      s.y += s.vy;
      if (s.y >= s.targetHeight) {
        const minDist = this.mushrooms.reduce( (acc, e) => {
          const dist = Math.abs(e.x - s.x);
          return Math.min(acc, dist);
        }, Infinity);
        if ((minDist > 10) || this.mushrooms.length < 2 ) {
          if (s.x > -100 && s.x < 600) {
            this.mushrooms.push({
              birth: this.t,
              x: s.x,
              y: s.y,
              growTime: this.lmap(Math.random(), 0, 1, 4, 7),
              dieTime: this.lmap(Math.random(), 0, 1, 4, 7),
              seeded: false,
              stemHeight: this.lmap(Math.random(), 0, 1, 50, 150),
              s: this.lmap(Math.random(), 0, 1, 50, 100),
              h: s.h,
              alive: true
            });
          }
        }
        s.alive = false;
      }
    });

    this.mushrooms.forEach( m => {
      const age = this.t - m.birth;
      if (age > m.growTime && !m.seeded) {
        m.seeded = true;
        for (let i = 0; i < 5 + Math.floor(5 * Math.random()); i++) {
          this.seeds.push({
            x: m.x,
            y: m.y - m.stemHeight,
            vx: this.lmap(Math.random(), 0, 1, -5, 5),
            vy: 0,
            h: m.h + this.lmap(Math.random(), 0, 1, -20, 20),
            targetHeight: Math.max(300, Math.min(500, m.y + Math.random() * 20 * Math.sin(Math.random() * 6.28))),
            alive: true
          });
        }
      }
      m.alive = age < (m.growTime + m.dieTime);
    });

    this.seeds = this.seeds.filter( s => s.alive );
    this.mushrooms = this.mushrooms.filter( m => m.alive );
    this.mushrooms.sort( (a, b) => a.y - b.y );
  }


  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 300, width, height);

    this.seeds.forEach( s => {
      ctx.fillStyle = `hsl(${s.h}, 100%, 50%)`;
      ctx.fillRect(s.x, s.y, 3, 3);
    });

    this.mushrooms.forEach( m => {
      const age = t - m.birth;
      const growFraction = Math.min(1, age / m.growTime);
      const dieFraction = Math.max(0, (age - m.growTime) / m.dieTime);
      const ageFraction = (t - m.birth) / (m.growTime + m.dieTime);

      //draw stem
      const stemWidth = this.lmap(growFraction, 0, 1, 1, 20);
      const stemHeight = growFraction < 1 ? this.lmap(growFraction, 0, 1, 1, m.stemHeight) : this.lmap(dieFraction, 0, 1, m.stemHeight, 1);
      const stemTopY = m.y - stemHeight;
      const sat = growFraction < 1 ? m.s : this.lmap(dieFraction, 0, 1, m.s, 0);
      ctx.fillStyle = `hsl(44, ${sat}%, 70%)`;
      ctx.fillRect(m.x - stemWidth / 2, stemTopY, stemWidth, stemHeight);

      //draw cap
      ctx.fillStyle = `hsl(${m.h}, ${sat}%, 50%)`;
      ctx.beginPath();
      ctx.moveTo(m.x - growFraction * 40, stemTopY);
      ctx.arcTo(m.x, stemTopY - growFraction * 40, m.x + growFraction * 40, stemTopY, growFraction * 30);
      ctx.lineTo(m.x + growFraction * 40, stemTopY);
      ctx.fill();

    });
  }
}

app.sketches[12] = new Sketch12();
app.sketches[12].desc = `You probably shouldn't eat these.`;
