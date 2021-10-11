'use strict';

class Sketch11 extends Sketch {
  constructor() {
    super();
    this.scale = 16;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  load() {
    super.load();
    this.emoji = {
      violin: '\ud83c\udfbb',
      note:   '\ud83c\udfb5',
      urn:    '\u26b1\ufe0f',
      walk:   '\ud83d\udeb6',
      coffin: '\u26b0\ufe0f',
      moon:   '\ud83c\udf19',
      tree:   '\ud83c\udf33'
    };

    this.notes = [];
    this.nextNote = 0;
    this.noteIndex = 0;
  }

  update() {
    if (this.t >= this.nextNote) {
      this.notes.push([this.noteIndex, this.t]);
      this.nextNote = this.t + 1 + (Math.random() > 0.5);
      this.noteIndex++;
    }

    this.notes = this.notes.filter( n => {
      return (this.t - n[1]) < 10;
    });
  }


  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'hsl(242, 30%, 17%)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'hsl(123, 39%, 17%)';
    ctx.fillRect(0, 300, width, height);

    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `hsla(60, 50%, 100%, ${this.lmap(Math.sin(t * (1 * this.rnd(i + 11) + 2) + 100 * this.rnd(i * 44)), -1, 1, 0, 1)})`;
      ctx.fillRect(width * this.rnd(i + 8), 300 * this.rnd(i + 10), 2, 2);
    }

    ctx.fillStyle = 'white';
    ctx.font = '170px Arial';
    ctx.fillText(this.emoji.tree, 0, 300);
    ctx.fillText(this.emoji.tree, 400, 300);

    ctx.font = '70px Arial';
    ctx.fillText(this.emoji.walk, 430, 400);

    ctx.font = '30px Arial';
    ctx.fillText(this.emoji.violin, 435, 380);

    ctx.font = '70px Arial';
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 5; x++) {
        ctx.fillText(this.emoji.coffin, 10 + 80 * x, 380 + 100 * y + 8 * this.rnd( y * 7 + x * 109 + 10 ));
      }
    }
 
    ctx.font = '30px Arial';
    this.notes.forEach( n => {
      const nt = t - n[1];
      const nx = nt * 50;
      const ny = 360 + nt * 10 * Math.cos(nt + 5 * this.rnd(n[0] * 99)) - 10 * nt;
      ctx.fillText(this.emoji.note, 430 - nx, ny);
    });

    ctx.font = '50px Arial';
    ctx.fillText(this.emoji.moon, 200, 50);
  }
}

app.sketches[11] = new Sketch11();
app.sketches[11].desc = `The music we play for the dead is only heard by us.`;
