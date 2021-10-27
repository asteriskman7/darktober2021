'use strict';

class Sketch31 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }


  load() {
    super.load();
    this.chars = [
      '\ud83c\udf83',
      '\ud83e\udd87',
      '\ud83c\udf6c',
      '\ud83d\udc7b',
      '\ud83d\ude08'
    ];
  }

  update() {
  }

  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    //text
    ctx.font = '100px Arial';
    ctx.fillStyle = 'white';
    ctx.translate(width / 2, 0);
    ctx.textAlign = 'center';
    ctx.fillText('Happy', 0, 100);
    ctx.fillText('Halloween', 0, 200);

    //characters moving around
    for (let i = 0; i < 5; i++) {
      const a = t + Math.PI * 2 * i / 5;
      const x = 200 * Math.cos(a);
      const y = 350 + 100 * Math.sin(a);
      const size = 100 + 50 * Math.sin(a);
      ctx.font = `${size}px Arial`;
      ctx.fillText(this.chars[i], x, y);
    }
  }
}

app.sketches[31] = new Sketch31();
app.sketches[31].desc = `Trick or treat?!`;
