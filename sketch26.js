'use strict';

class Sketch26 extends Sketch {
  constructor() {
    super();
    this.scale = 1;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
  }

  rndInArray(a) {
    return a[Math.floor(Math.random() * a.length)];
  }

  rndFromArray(a) {
    const i = Math.floor(Math.random() * a.length);
    const v = a[i];
    a.splice(i, 1);
    return v;
  }

  load() {
    super.load();

    this.emoji = [];
    this.emoji.push('\u2648');
    this.emoji.push('\u2649');
    this.emoji.push('\u264A');
    this.emoji.push('\u264B');
    this.emoji.push('\u264C');
    this.emoji.push('\u264D');
    this.emoji.push('\u264E');
    this.emoji.push('\u264F');
    this.emoji.push('\u2650');
    this.emoji.push('\u2651');
    this.emoji.push('\u2652');
    this.emoji.push('\u2653');

    //generate messages
    this.signs = 'Aries,Taurus,Gemini,Cancer,Leo,Virgo,Libra,Scorpio,Sagittarius,Capricorn,Aquarius,Pisces'.split`,`;
    const colorList = [];
    for (let i = 0; i < 12; i++) {
      colorList.push(i * 360 / 12);
    }
    this.colors = [];
    while (colorList.length > 0) {
      const ci = Math.floor(Math.random() * colorList.length);
      this.colors.push(colorList[ci]);
      colorList.splice(ci, 1);
    }

    this.messages = [];
    const openings = 'Hello,Hi,Yo,Greetings,Howdy,Bonjour,Hey,Hi there,Hey buddy,What\'s up,Sup,Hey there,Yay it\'s,How are you'.split`,`;
    const descripts = 'adorable,charming,loyal,stubborn,creative,distant,mischievous,adventurous,sensitive,wise,assertive,faithful,loving'.split`,`;
    const todays = 'great,sublime,trying,frustrating,fun,tiring,balancing,humorous,troubling,firey,calming,boring,dull,sleepy,energizing,charged,explosive,irksome,invigorating'.split`,`;
    const cautions = 'bugs,cats,dogs,enemies,birds,spiders,meteors,cars,bullets,earthquakes,hurricanes,tornados,poisons,tripping,falling,ladders,fires,witches,ghosts,skeletons'.split`,`;
    for (let i = 0; i < 12; i++) {
      const opening = this.rndInArray(openings);
      const descript = this.rndFromArray(descripts);
      let greeting = [opening, descript, this.signs[i]].join` ` + '!';
      const today = this.rndFromArray(todays);
      let good = 'Today will be ' + today + '.';
      const caution = this.rndFromArray(cautions);
      let bad = 'Look out for "' + caution + '"!';
      let msg = [greeting, good, bad];
      this.messages.push(msg);
    }
  }

  update() {
  }

  draw(ctx, width, height, t, mousePoint) {
    //draw 4x3
    const hcount = 3;
    const vcount = 4;
    const boxWidth = this.width / hcount;
    const boxHeight = this.height / vcount;

    ctx.textAlign = 'center';

    for (let i = 0; i < 12; i++) {
      const boxX = i % hcount;
      const boxY = Math.floor(i / hcount);
      const sign = this.signs[i];
      //background
      ctx.fillStyle = `hsl(${this.colors[i]}, 40%, 30%)`;
      ctx.fillRect(boxX * boxWidth, boxY * boxHeight, boxWidth, boxHeight);

      //border
      ctx.strokeStyle = 'black';
      ctx.strokeRect(boxX * boxWidth, boxY * boxHeight, boxWidth, boxHeight);

      //title
      ctx.font = '20px Arial';
      //ctx.fillStyle = `hsl(${this.colors[i] + 180}, 100%, 50%)`;
      ctx.fillStyle = 'white';
      ctx.fillText(this.signs[i] + this.emoji[i], boxX * boxWidth + boxWidth * 0.5, boxY * boxHeight + 30);

      //message
      ctx.font = '10px Arial';
      ctx.fillText(this.messages[i][0], boxX * boxWidth + boxWidth * 0.5, boxY * boxHeight + 60);
      ctx.fillText(this.messages[i][1], boxX * boxWidth + boxWidth * 0.5, boxY * boxHeight + 80);
      ctx.fillText(this.messages[i][2], boxX * boxWidth + boxWidth * 0.5, boxY * boxHeight + 100);
    }
  }

}

app.sketches[26] = new Sketch26();
app.sketches[26].desc = `Your horoscope for today!`;
