'use strict';

class Sketch24 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  load() {
    super.load();
  }

  update() {
  }

  draw(ctx, width, height, t, mousePoint) {

    //background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, 'white');
    bgGrad.addColorStop(1, 'hsl(229, 42%, 52%)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width/2, 0);

    //door glow
    ctx.fillStyle = `hsla(49, 100%, 50%, 0.3)`;
    const glowGrad = ctx.createRadialGradient(0, 50, 5, 0, 50, 50);
    glowGrad.addColorStop(0, 'hsla(49, 100%, 50%, 0.3)');
    glowGrad.addColorStop(1, 'hsla(49, 100%, 50%, 0.0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 50, 50, 0, Math.PI * 2);
    ctx.fill();

    //light door
    const doorWidth = 5;
    ctx.fillStyle = 'white';
    ctx.fillRect(-doorWidth, 50, doorWidth * 2, doorWidth * 4 );

    //stairs
    let lastWidth = doorWidth;
    let lastHeight = 1;
    let lastY = 50 + doorWidth * 4;
    let f = Math.pow(Math.sin((t % 1) * Math.PI / 2), 4);
    for (let i = 0; i <= 20; i++) {
      const h = 1 + 2 * i + f * 2 ;
      const y = lastY + lastHeight;
      const w = Math.pow(h, 1.5);
      const grad = ctx.createLinearGradient(0, y, 0, y + h);
      grad.addColorStop(0, 'white');
      grad.addColorStop(1, `hsl(0, 0%, ${this.lmap(y, 50 + doorWidth * 4, 512, 90, 30)}%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(-w, y, w * 2, h);
      lastWidth = w;
      lastHeight = h;
      lastY = y;
    }

  }

}

app.sketches[24] = new Sketch24();
app.sketches[24].desc = `What has your attempt to buy a stairway to heaven cost you?`;
