'use strict';

class Sketch18 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  initScratch(ctx) {
    ctx.save();
    ctx.font = '150px Arial';
    ctx.translate(100, 100);
    ctx.textAlign = 'center';
    ctx.fillText(this.emoji.wow, 0, 50);
    const img = ctx.getImageData(0, 0, 200, 200);
    const data = img.data;
    for (let x = 0; x < 200; x++) {
      for (let y = 0; y < 200; y++) {
        const i = (x + y * 200) * 4;
        let r = data[i + 0];
        let g = data[i + 1];
        let b = data[i + 2];

        if (r + g + b < 10) {
          r = 33; 
          g = 131;
          b = 118;
        } else if (r + g + b > 100) {
          r = 161;
          g = 232;
          b = 222;
        }

        data[i + 0] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
    }
    ctx.putImageData(img, 0, 0);
    ctx.restore();
  }

  load() {
    super.load();
    this.emoji = {};
    this.emoji.face = '\ud83d\ude2c';
    this.emoji.dizzy = '\ud83d\ude35';
    this.emoji.wow = '\ud83d\ude2e';
    this.emoji.fist = '\ud83e\udd1c';
    this.cscratch = document.createElement('canvas');
    this.cscratch.width = 200;
    this.cscratch.height = 200;
    this.ctxscratch = this.cscratch.getContext('2d');
    this.initScratch(this.ctxscratch);

  }

  update() {
  }


  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = `hsl(36, 60%, 27%)`;
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width / 2, 0);

    ctx.font = '150px Arial';
    ctx.fillStyle = 'hsl(0, 0%, 20%)';
    ctx.textAlign = 'center';
    const fistX = this.lmap(Math.pow(Math.sin(2 * t), 4), 0, 1, -350, -100);
    const faceX = Math.max(0, fistX + 150);
    const faceType = faceX > 0 ? this.emoji.dizzy : this.emoji.face;

    //ctx.fillText(this.emoji.wow, faceX * 4, 400 - faceX * 4);
    ctx.drawImage(this.cscratch, -100 + faceX * 4, -150 + 400 - faceX * 4);

    ctx.fillText(faceType, faceX, 400);

    ctx.fillText(this.emoji.fist, fistX, 430);


  }
}

app.sketches[18] = new Sketch18();
app.sketches[18].desc = `Try to keep your soul inside your body.`;
