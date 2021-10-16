'use strict';

class Sketch16 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  load() {
    super.load();
    this.objects = [];

    for (let i = 0; i < 10; i++) {
      const a = Math.random() * 2 * Math.PI;
      const v = 3;
      const dx = v * Math.cos(a);
      const dy = v * Math.sin(a);
      this.objects.push({
        x: this.lmap(Math.random(), 0, 1, 50, this.width - 50),
        y: this.lmap(Math.random(), 0, 1, 50, this.height - 50),
        dx,
        dy,
        state: 'h'
      });
    }
  }

  update() {
    const r = 40;
    this.objects.forEach( o => {
      const newX = o.x + o.dx;
      const newY = o.y + o.dy;

      if (newX < r) {
        o.dx = -o.dx; 
      } 
      if (newX > (this.width - r)) {
        o.dx = -o.dx;
      }
      if (newY < r * 1.2) {
        o.dy = -o.dy;
      }
      if (newY > (this.height - r)) {
        o.dy = -o.dy;
      }

      o.x = newX;
      o.y = newY;
      o.state = 's';
    });

    for (let i = 0; i < this.objects.length - 1; i++) {
      for (let j = i + 1; j < this.objects.length; j++) {
        const dx = this.objects[i].x - this.objects[j].x;
        const dy = this.objects[i].y - this.objects[j].y;
        const d2 = dx * dx + dy * dy;

        if (d2 < 7000) {
          this.objects[i].state = 'h';
          this.objects[j].state = 'h';
        }
      }
    }
  }


  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = `hsl(226, 60%, 52%)`;
    ctx.fillRect(0, 0, width, height);

    const hface = '\ud83d\ude00';
    const sface = '\ud83d\ude2d';
    const faces = {h: hface, s: sface};

    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    this.objects.forEach( o =>  {
      ctx.fillText(faces[o.state], o.x, o.y);
    });

  }
}

app.sketches[16] = new Sketch16();
app.sketches[16].desc = `Which version of yourself is the real one?`;
