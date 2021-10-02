'use strict';

class Sketch2 extends Sketch {
  constructor() {
    super();
    this.scale = 32;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;

  }

  //build a new maze

  load() {
    super.load();
  }

  update() {

  }

  draw(ctx, width, height, t, mousePoint) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    const speed = 10;
    t = t * speed;

    const vt = t % 1;
    const rowCount = 62;
    const colCount = 32;
    const colSize = width / colCount;
    const groundHeight = height * 0.5;
    const rowHeight = groundHeight / rowCount;
    
    //draw ground
    for (let row = 0; row < rowCount; row++) {
      const rowIndex = row - Math.floor(t);
      ctx.fillStyle = `hsl(119, ${100 * this.rnd(rowIndex / rowCount)}%, 50%)`;
      ctx.beginPath();
      const a = 0.01;
      const factor = (1 - a/((((rowCount - row) - vt)/rowCount)+a));
      const rowy = height - groundHeight * factor;
      ctx.moveTo(0, rowy);
      for (let x = 1; x <= colCount; x++) {
        ctx.lineTo(x * colSize, rowy + (1/factor) * row * this.rnd(rowIndex * x + 1));
      }
      ctx.lineTo(1000, 1000);
      ctx.lineTo(-1000, 1000);
      ctx.closePath();
      ctx.fill();
    }

    //draw sky
    for (let row = 0; row < rowCount; row++) {
      const rowIndex = row - Math.floor(t);
      const a = 0.1;
      const factor = (1 - a/((((rowCount - row) - vt)/rowCount)+a));
      const rowy = groundHeight * factor;
      ctx.fillStyle = `hsla(48, ${100 * this.rnd(rowIndex / rowCount)}%, 90%, ${1-factor})`;
      for (let x = 1; x <= colCount; x++) {
        const xpos = x * colSize + -100 + 100 * this.rnd(rowIndex * x + 1);
        const ydelta = factor * (-5 + 10 * this.rnd(rowIndex * x * 2 + 1));
        if (this.rnd(rowIndex * x + 1) > 0.9) {
          ctx.fillRect(xpos, rowy + ydelta, 2, 2);
        }
      }
    }

  }
}

app.sketches[2] = new Sketch2();
app.sketches[2].desc = `When the world is falling apart around you just keep running.`;
