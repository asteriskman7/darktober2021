'use strict';

class Sketch13 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  load() {
    super.load();

    const words = "SLASHER,KILLER,MURDER,DEATH,SLICE".split`,`;
    this.word = words[Math.floor(Math.random() * words.length)];

    const ctx = this.ctx;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.font = '70px Serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(this.word, this.width / 2, 150);

    //find all bottoms
    const data = ctx.getImageData(0, 0, this.width, this.height).data;
    const bottoms = [];
    let maxBottom = 0;
    for (let x = 0; x < this.width; x++) {
      let found = false;
      for (let y = this.height - 1; y >= 0; y--) {
        const dataIndex = (x + y * this.width) * 4;
        const r = data[dataIndex + 0];
        if (r > 10) {
          maxBottom = Math.max(maxBottom, y);
          bottoms.push(y);
          found = true;
          break;
        }
      }
      if (!found) {
        bottoms.push(-1);
      }
    }

    //remove high bottoms
    this.bottoms = bottoms.map( b => {
      if (b < (maxBottom - 2)) {
        return -1;
      } else {
        return b;
      }
    });

    //find edges of bottoms
    const groups = [];
    const groupWidth = 5;
    let groupStart = -1;
    this.bottoms.forEach( (b, i) => {
      if (b > 0) {
        if (groupStart === -1) {
          groupStart = i;
        }
      } else {
        if (groupStart !== -1) {
          groups.push({
            x: groupStart + groupWidth / 2, 
            y: this.bottoms[groupStart],
            len: this.lmap(Math.random(), 0, 1, 30, 100)
          });
          groups.push({
            x: (i - 1) - groupWidth / 2, 
            y: this.bottoms[i - 1],
            len: this.lmap(Math.random(), 0, 1, 30, 100)
          });
          groupStart = -1;
        }
      }
    });

    this.groups = groups;


    //ctx.clearRect(0, 0, this.width, this.height);
  }

  update() {
  }


  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, width, height);

    ctx.font = '70px Serif';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText(this.word, width / 2, 150);

    ctx.fillStyle = 'red';
    const pathWidth = 5;
    ctx.lineCap = 'round';
    this.groups.forEach( g => {
      ctx.lineWidth = pathWidth;
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.lineTo(g.x, g.y + (t / 10) * g.len);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(g.x, g.y + (t / 10) * g.len, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(Math.round(g.x - pathWidth / 2 + 1), g.y);
      ctx.lineTo(Math.round(g.x - pathWidth / 2 + 1), g.y + (t / 10) * g.len);
      ctx.stroke();
    });
  }
}

app.sketches[13] = new Sketch13();
app.sketches[13].desc = `Whatch where you're dripping!`;
