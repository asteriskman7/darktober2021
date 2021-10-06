'use strict';

class Sketch8 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  //modified from https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
  //to return s and l from 0 to 100 instead of 0 to 1
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h;
    if (d === 0) h = 0;
    else if (max === r) h = (g - b) / d % 6;
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    let l = (min + max) / 2;
    let s = d === 0 ? 0 :  d / (1 - Math.abs(2 * l - 1));
    return{h: h * 60, s: s * 100, l: l * 100};
  }

  initTargetImage() {
    //draw text and emoji
    this.tcanvas = document.createElement('canvas');
    this.tcanvas.width = this.width;
    this.tcanvas.height = this.height;
    this.tctx = this.tcanvas.getContext('2d');
    this.tctx.fillStyle = 'white';
    this.tctx.fillRect(0, 0, this.width, this.height);
    this.tctx.font = 'bold 100px Arial';
    this.tctx.textAlign = 'center';
    this.tctx.fillStyle = 'black';
    this.tctx.fillText('Happy', 256, 100);
    this.tctx.fillText('Halloween', 256, 220);
    this.tctx.font = '200px Arial';
    const emojiOptions = [
      '\ud83c\udf83',
      '\ud83e\udd87',
      '\ud83c\udf6c',
      '\ud83d\udc7b',
      '\ud83d\ude08'
    ];
    const emoji = emojiOptions[Math.floor(emojiOptions.length * Math.random())];
    this.tctx.fillText(emoji, 256, 440);


    //convert target image into grid colors
    this.gridSize = 8;

    const imageData = this.tctx.getImageData(0, 0, this.width, this.height).data;
    this.imgGrid = [];
    for (let x = 0; x < this.width / this.gridSize; x++) {
      const col = [];
      for (let y = 0; y < this.height / this.gridSize; y++) {
        const datai = (x * this.gridSize + y * this.gridSize * this.width) * 4;
        col.push({
          hsl: this.rgbToHsl(imageData[datai + 0], imageData[datai + 1], imageData[datai + 2]),
          show: false
        });
      }
      this.imgGrid.push(col);
    }
    this.drawQueue = [];
  }

  load() {
    super.load();
    this.initTargetImage();

    //draw fabric
    const ctx = this.ctx;
    ctx.fillStyle = 'hsl(60, 82%, 87%)';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.strokeStyle = 'hsl(60, 82%, 72%)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < this.width / this.gridSize; x++) {
      ctx.moveTo((x + 0.5) * this.gridSize, 0);
      ctx.lineTo((x + 0.5) * this.gridSize, this.height);
    }
    for (let y = 0; y < this.height / this.gridSize; y++) {
      ctx.moveTo(0, (y + 0.5) * this.gridSize);
      ctx.lineTo(this.width, (y + 0.5) * this.gridSize);
    }
    ctx.stroke();
  }

  update() {
    //fill in a random stitch
    for (let i = 0; i < 10000; i++) {
      const x = Math.floor(Math.floor(this.width / this.gridSize) * Math.random());
      const y = Math.floor(Math.floor(this.height / this.gridSize) * Math.random());
      if (this.imgGrid[x][y].show === false) {
        this.imgGrid[x][y].show = true;
        this.drawQueue.push({x, y});
        return;
      }
    }
    //if we couldn't find a missing stitch assume the image is complete and reload
    this.load();
  }

  draw(ctx, width, height, t, mousePoint) {
    //add some stitches near the mouse to the queue
    const px = Math.round(mousePoint.x / this.gridSize);
    const py = Math.round(mousePoint.y / this.gridSize);
    const pw = 3;
    const mind = -Math.floor(pw / 2);
    const maxd = -mind;
    for (let dx = mind; dx <= maxd; dx++) {
      const px2 = px + dx;
      if (px2 < 0 || px2 >= (this.width / this.gridSize)) {continue;}
      for (let dy = mind; dy <= maxd; dy++) {
        const py2 = py + dy;
        if (py2 < 0 || py2 >= (this.height / this.gridSize)) {continue;}
        
        if (this.imgGrid[px2][py2].show === false) {
          this.imgGrid[px2][py2].show = true;
          this.drawQueue.push({x: px2, y: py2});
        }
      }
    }

    //draw every stitch in the queue
    this.drawQueue.forEach( p => {
      const x = p.x;
      const y = p.y;
      const cell = this.imgGrid[x][y];
      const color = cell.hsl;
      //clamp maximum luminance
      if (color.l > 80) {
        color.l = 80;
        color.s = 0;
      }
      //draw / line and highlight
      ctx.strokeStyle = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo((x + 1) * this.gridSize, y * this.gridSize);
      ctx.lineTo(x * this.gridSize, (y + 1) * this.gridSize);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `hsl(${color.h}, ${color.s}%, ${Math.min(100, (100 + color.l) / 2)}%)`;
      ctx.beginPath();
      ctx.moveTo((x + 1) * this.gridSize - 3, y * this.gridSize);
      ctx.lineTo(x * this.gridSize, (y + 1) * this.gridSize - 3);
      ctx.stroke();

      //draw \ line and highlight
      ctx.strokeStyle = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x * this.gridSize, y * this.gridSize);
      ctx.lineTo((x + 1) * this.gridSize, (y + 1) * this.gridSize);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `hsl(${color.h}, ${color.s}%, ${Math.min(100, (100 + color.l) / 2)}%)`;
      ctx.beginPath();
      ctx.moveTo(x * this.gridSize + 3, y * this.gridSize);
      ctx.lineTo((x + 1) * this.gridSize, (y + 1) * this.gridSize - 3);
      ctx.stroke();
    });
    //clear queue
    this.drawQueue = [];
  }
}

app.sketches[8] = new Sketch8();
app.sketches[8].desc = `Arts and crafts are good ways to relax and have fun!`;
