'use strict';

class Sketch3 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  load() {
    super.load();
    this.agents = [];
    for (let i = 0; i < 100; i++) {
      const human = {
        type: 'human',
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        dir: Math.random() * 6.28,
        speed: 1,
        bday: 0,
        alive: true
      };
      this.agents.push(human);
    }
    this.agents.push({
      type: 'vampire',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      dir: Math.random() * 6.28,
      speed: 1.5,
      bday: 0,
      alive: true
    });
  }

  getNearest(a, ai, type) {
    let minDist2 = Infinity;
    let nearest = undefined;
    this.agents.forEach( (na, nai) => {
      if (ai === nai) {return;}
      if (na.type !== type) {return;}
      if (na.alive === false) {return;}
      const dist2 = (a.x - na.x) * (a.x - na.x) + (a.y - na.y) * (a.y - na.y);
      if (dist2 < minDist2) {
        minDist2 = dist2;
        nearest = na;
        nearest.dist2 = minDist2;
      }
    });
    return nearest;
  }


  update() {
    const newAgents = [];
    let humanCount = 0;
    let vampireCount = 0;

    this.agents.forEach( (a, ai) => {
      //updatePosition
      let nearest;
      if (a.type === 'human') {
        humanCount++;
        nearest = this.getNearest(a, ai, 'vampire');
        if (nearest !== undefined && nearest.dist2 < 400) {
          a.dir = Math.atan2(a.y - nearest.y, a.x - nearest.x);
        } else {
          a.dir += Math.random() - 0.5;
        }
      } else {
        vampireCount++;
        nearest = this.getNearest(a, ai, 'human');
        if (nearest !== undefined) {
          a.dir = Math.atan2(nearest.y - a.y, nearest.x - a.x);
        }
      }
      const age = this.t - a.bday;
      if (a.type === 'human' || age > 1) { 
        a.x += a.speed * Math.cos(a.dir);
        a.y += a.speed * Math.sin(a.dir);
        if (a.x < 0) {a.x += this.width;}
        if (a.x >= this.width) {a.x -= this.width;}
        if (a.y < 0) {a.y += this.height;}
        if (a.y >= this.height) {a.y -= this.height;}
      }
      
      //procreate
      if (a.type === 'human') {
        if (age > 5 && Math.random() > 0.5) {
          this.agents.some( (na, nai) => {
            const nage = this.t - na.bday;
            if (na.type === 'human' && nage > 5 && ai !== nai && (this.agents.length + newAgents.length) < 200) {
              const dist2 = (a.x - na.x) * (a.x - na.x) + (a.y - na.y) * (a.y - na.y);
              if (dist2 < (20000 / this.agents.length)) {
                newAgents.push({
                  type: 'human',
                  x: a.x + (Math.random() - 0.5) * 20,
                  y: a.y + (Math.random() - 0.5) * 20,
                  dir: Math.random() * 6.28,
                  speed: 1,
                  bday: this.t,
                  alive: true
                });
                a.bday = this.t;
                na.bday = this.t;

                return true;
              }
            }
          });
        }
      } else {
        //eat/die
        if (nearest !== undefined && nearest.dist2 < 4) {
          a.bday = this.t;
          if (Math.random() < 0.7) {
            nearest.alive = false;
          } else {
            nearest.speed = 1.5;
            nearest.type = 'vampire';
            nearest.bday = this.t;
          }
        } else {
          if (age > 5) {
            a.alive = false;
          }
        }
      }
    });

    //die
    this.agents = this.agents.filter( a => a.alive );
    newAgents.forEach( a => {
      this.agents.push(a);
    });

    if (vampireCount === 0 || humanCount === 0) {
      this.load();
    }
    this.vampireCount = vampireCount;
    this.humanCount = humanCount;
  }

  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, width, height);

    this.agents.forEach( a => {
      ctx.fillStyle = a.type === 'human' ? 'yellow' : 'red';
      ctx.fillRect(a.x, a.y, 3, 3);
    });

    ctx.fillStyle = 'yellow';
    ctx.fillText(this.humanCount, 10, 10);
    ctx.filStyle = 'black';
    ctx.fillText('vs', 10, 20);
    ctx.fillStyle = 'red';
    ctx.fillText(this.vampireCount, 10, 30);
  }
}

app.sketches[3] = new Sketch3();
app.sketches[3].desc = `Are you predator or prey?`;
