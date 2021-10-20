'use strict';

class Sketch20 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  makebwperson() {
    this.cmap.person = document.createElement('canvas');
    const size = 200;
    this.cmap.person.width = size;
    this.cmap.person.height = size;
    const ctx = this.cmap.person.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.font = '150px arial';
    ctx.fillText(this.emoji.person, 0, 150);

    const img = ctx.getImageData(0, 0, size, size);
    const data = img.data;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const i = (x + y * size) * 4;
        let r = data[i + 0];
        let g = data[i + 1];
        let b = data[i + 2];
        let a = data[i + 3];
        
        const shadowValue = 80;
        if (a > 10) {
          r = shadowValue;
          g = shadowValue;
          b = shadowValue;
          a = 255;
        } else {
          a = 0;
        }

        data[i + 0] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = a;
      }
    }
    ctx.putImageData(img, 0, 0);
    this.blur(ctx, data, size, 5);
  }

  makebwtree() {
    this.cmap.tree = document.createElement('canvas');
    const size = 500;
    this.cmap.tree.width = size;
    this.cmap.tree.height = size;
    const ctx = this.cmap.tree.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.font = '350px arial';
    ctx.fillText(this.emoji.tree, 0, 350);

    const img = ctx.getImageData(0, 0, size, size);
    const data = img.data;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const i = (x + y * size) * 4;
        let r = data[i + 0];
        let g = data[i + 1];
        let b = data[i + 2];
        let a = data[i + 3];
        
        const shadowValue = 80;
        if (a > 10) {
          r = shadowValue;
          g = shadowValue;
          b = shadowValue;
          a = 255;
        } else {
          a = 0;
        }

        data[i + 0] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = a;
      }
    }
    ctx.putImageData(img, 0, 0);
    this.blur(ctx, data, size, 10);
  }

  makebwtiger() {
    this.cmap.tiger = document.createElement('canvas');
    
    const size = 200;
    this.cmap.tiger.width = size;
    this.cmap.tiger.height = size;
    const ctx = this.cmap.tiger.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.font = '150px arial';
    ctx.fillText(this.emoji.tiger, 0, 130);
    
    const img = ctx.getImageData(0, 0, size, size);
    const data = img.data;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const i = (x + y * size) * 4;
        let r = data[i + 0];
        let g = data[i + 1];
        let b = data[i + 2];
        let a = data[i + 3];
        
        const shadowValue = 80;
        if (a > 10) {
          r = shadowValue;
          g = shadowValue;
          b = shadowValue;
          a = 255;
        } else {
          a = 0;
        }

        data[i + 0] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = a;
      }
    }
    ctx.putImageData(img, 0, 0);
    this.blur(ctx, data, size, 15);
  }

  blur(ctx, data, size, rad) {
    const newImage = ctx.createImageData(size, size);
    const newData = newImage.data;
    const shadowValue = 80;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const i = (x + y * size) * 4;
        let r = data[i + 0];
        let g = data[i + 1];
        let b = data[i + 2];
        let a = data[i + 3];
        
        if (a < 1) {
          let closest = Infinity;
          for (let dx = -rad; dx <= rad; dx++) {
            const x2 = x + dx;
            if (x2 < 0 || x2 >= size) {continue;}
            for (let dy = -rad; dy <= rad; dy++) {
              const y2 = y + dy;
              if (y2 < 0 || y2 >= size) {continue;}
              const i2 = (x2 + y2 * size) * 4;
              let r2 = data[i2 + 0];
              let g2 = data[i2 + 1];
              let b2 = data[i2 + 2];
              let a2 = data[i2 + 3];

              if (a2 > 1) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                closest = Math.min(closest, dist);
              }
            }
          }

          r = shadowValue;
          g = shadowValue;
          b = shadowValue;
          if (closest > rad) {
            a = 0;
          } else {
            a = Math.round(255 * (rad - closest) / rad);
          }
        }


        newData[i + 0] = r;
        newData[i + 1] = g;
        newData[i + 2] = b;
        newData[i + 3] = a;

      }
    }
    ctx.putImageData(newImage, 0, 0);
    
  }

  load() {
    super.load();
    this.emoji = {};
    this.emoji.person = '\ud83d\udeb6';
    this.emoji.tree = '\ud83c\udf34';
    this.emoji.tiger = '\ud83d\udc05';
    this.cmap = {};
    this.makebwperson();
    this.makebwtree();
    this.makebwtiger();
  }

  update() {
  }


  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = `hsl(0, 0%, 90%)`;
    ctx.fillRect(0, 0, width, height);


    const duration = 5;
    const f = (t % duration) / duration;

    const px = this.lmap(f, 0, 1, 512, -450);
    const py = this.lmap(Math.sin(f * 70), -1, 1, 0, -5);

    const tx = f < 0.5 ? 
      this.lmap(Math.pow(Math.sin((f * 2) * Math.PI / 2), 6), 0, 1, 600, 250)
    :
      this.lmap(Math.pow(Math.sin(((f + 0.5) * 2) * Math.PI / 2), 16), 0, 1, 250, -250) ;

    ctx.drawImage(this.cmap.person, px, 220 + py);
    ctx.drawImage(this.cmap.tiger, tx, 240);
    ctx.drawImage(this.cmap.tree, 50, -20);

    ctx.fillStyle = `hsl(0, 0%, 50%)`;
    ctx.fillRect(0, 400, width, height);

  }
}

app.sketches[20] = new Sketch20();
app.sketches[20].desc = `Beware of tigers hiding in the shadows.`;
