'use strict';

class Sketch23 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  load() {
    super.load();
    this.emoji = {};
    this.emoji.cloud = '\u2601\ufe0f';
  }

  update() {
  }

  draw(ctx, width, height, t, mousePoint) {
    const waveBase = 100 + 100 * Math.sin(t * 1);

    //sky
    ctx.fillStyle = `hsl(214, 60%, ${this.lmap(waveBase, 0, 200, 30, 67)}%)`;
    ctx.fillRect(0, 0, width, height);

    //clouds
    ctx.fillStyle = `hsl(0, 0%, ${this.lmap(waveBase, 0, 200, 40, 100)}%)`;
    ctx.beginPath();
    ctx.arc(100, waveBase - 100, 30, 0, 2 * Math.PI);
    ctx.arc(130, waveBase - 110, 40, 0, 2 * Math.PI);
    ctx.arc(160, waveBase - 100, 30, 0, 2 * Math.PI);
    ctx.fill();

    //sun
    ctx.fillStyle = `hsl(47, 100%, ${this.lmap(waveBase, 0, 200, 30, 67)}%)`;
    ctx.beginPath();
    ctx.arc(width, waveBase - 200, 50, 0, 2 * Math.PI);
    ctx.fill();

    //waves
    const waterL = this.lmap(waveBase, 0, 200, 10, 50);
    ctx.fillStyle = `hsl(240, 100%, ${waterL}%)`;
    ctx.beginPath();
    ctx.moveTo(-10, waveBase);
    for (let x = 0; x < width; x++) {
      const y = waveBase + 
        10 * Math.sin(x/50 + t) + 
        5 * Math.sin(x / 25 + t * 10) +
        2  * Math.sin(x / 12 + t * 30);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width + 1, waveBase);
    ctx.lineTo(width + 1, height + 1);
    ctx.lineTo(0, height + 1);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 4;
    for (let x = 0; x < width; x++) {
      const y1 =  
        10 * Math.sin(x/50 + t) + 
        5 * Math.sin(x / 25 + t * 10) +
        2  * Math.sin(x / 12 + t * 30);
      const y2 = waveBase + 
        10 * Math.sin((x+1)/50 + t) + 
        5 * Math.sin((x+1) / 25 + t * 10) +
        2  * Math.sin((x+1) / 12 + t * 30);
      ctx.strokeStyle = `hsl(240, 100%, ${this.lmap(y1, 17, -17, 50 * waterL / 50, 100 * waterL / 50)}%)`;
      ctx.beginPath();
      ctx.moveTo(x, waveBase + y1);
      ctx.lineTo(x+1, y2);
      ctx.stroke();
    }

    //eyes
    const frame = Math.floor((t * 6) % 10);
    if (frame === 0) {return;}
    const ex = 100 + 5 * Math.sin(2.5 * t);
    const ey = waveBase + 450 + 5 * Math.sin(1.2 * t);
    for (let i = 10; i > 0; i--) {
      const er = i / 1.5;
      const dx = 35;
      ctx.fillStyle = `hsla(${this.lmap(waveBase, 0, 200, 185, 240)}, 100%, 30%, 0.5)`;
      ctx.beginPath();
      ctx.arc(ex, ey, er, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex + dx, ey, er, 0, 2 * Math.PI);
      ctx.fill();
    }

  }

}

app.sketches[23] = new Sketch23();
app.sketches[23].desc = `Only 5% of Earth's oceans have been explored.`;
