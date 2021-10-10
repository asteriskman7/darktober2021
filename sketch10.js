'use strict';

class Sketch10Tail {
  constructor(sketch, head) {
    this.sketch = sketch;
    this.head = head;
    this.x = head.x;
    this.y = head.y;
    this.size = 1;
    this.tail = undefined;
    //init trail
    this.trail = [];
    for (let i = 0; i < 7; i++) {
      this.trail.push({x: this.x, y: this.y});
    }
  }

  addTail() {
    if (this.tail === undefined) {
      this.tail = new Sketch10Tail(this.sketch, this);
    } else {
      this.tail.addTail();
    }
  }

  die() {
    if (this.tail !== undefined) {
      this.tail.die();
    }
    this.tail = undefined;
  }

  update() {
    //follow head
    const startx = this.x;
    const starty = this.y;
    this.x = this.head.trail[0].x;
    this.y = this.head.trail[0].y;
    if (this.x !== startx || this.y !== starty) {
      this.trail.shift();
      this.trail.push({x: startx, y: starty});
    }
    if (this.tail !== undefined) {
      this.tail.update();
    }
  }

  draw(ctx, scale, t) {
    const poweredFractionRemaining = (this.sketch.player.powerEnd - t) / 10;
    const flashRate = poweredFractionRemaining > 0.25 ? 0 : 200;
    const colorIndex = this.sketch.player.powered ? Math.round(0.5 + 0.5 * Math.cos(poweredFractionRemaining * flashRate)) : 0;
    ctx.fillStyle = ['yellow', 'blue'][colorIndex];
    ctx.beginPath();
    ctx.arc((this.x + 0.5) * scale, (this.y + 0.5) * scale, 0.7 * this.size * scale, 0, Math.PI * 2);
    ctx.fill();
    if (this.tail !== undefined) {
      this.tail.draw(ctx, scale, t);
    }
  }
}

class Sketch10Player {
  constructor(sketch, x, y, dir) {
    this.sketch = sketch;
    this.startx = x;
    this.starty = y;
    this.startdir = dir;
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.powered = false;
    this.eatCount = 0;
    this.powerEnd = -1;
    this.tailSize = 0;
    this.length = 0;
    this.lastKey = 0;
    this.tail = undefined;
    this.trail = [];
    for (let i = 0; i < 7; i++) {
      this.trail.push({x: this.x, y: this.y});
    }
    this.dead = false;
    this.score = 0;
    this.dirAngleMap = {
      l: 0,
      r: Math.PI,
      u: Math.PI / 2,
      d: -Math.PI / 2
    };
    this.dirMoveMap = {
      l: [-1, 0],
      r: [1, 0],
      u: [0, -1],
      d: [0, 1]
    };
    this.dirCheckAdd = {
      l: [0, 0],
      r: [1, 0],
      u: [0, 0],
      d: [0, 1]
    }
  }

  update() {
    const startx = this.x;
    const starty = this.y;
    //try to move in the player direction without going off the valid path
    const move = this.dirMoveMap[this.dir];
    const speed = 0.2;
    const newX = this.x + move[0] * speed;
    const newY = this.y + move[1] * speed;
    const dirCheck = this.dirCheckAdd[this.dir];
    const gridX = Math.floor(newX + dirCheck[0]);
    const gridY = Math.floor(newY + dirCheck[1]);
    if (this.sketch.board[gridY][gridX] === ' ') {
      this.x = newX;
      this.y = newY;
      if (this.dir === 'l' || this.dir === 'r') {
        this.y = Math.round(this.y);
      }
      if (this.dir === 'u' || this.dir === 'd') {
        this.x = Math.round(this.x);
      }
    } else {
      //if we can't take a step, round the position to make it easier to turn
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
    }

    //wrap around horizontally
    if (this.x < 0.2 && this.y === 14 && this.dir === 'l') {
      this.x = 27;
    }
    if (this.x > 26.8 && this.y === 14 && this.dir === 'r') {
      this.x = 0;
    }
    //TODO: add vertical wrap

    //if we actually moved, update the trail
    if (this.x !== startx || this.y !== starty) {
      this.trail.shift();
      this.trail.push({x: startx, y: starty});
    }


    const keys = {...this.sketch.keys};
    //handle idle mode
    const idleTime = 5;
    const demoTime = 30;
    let idleKey = false;
    if (this.sketch.t - this.lastKey > idleTime && !(keys.w || keys.s || keys.a || keys.d)) {
      //select a random key that isn't just moving backwards
      keys.w = Math.random() > 0.90 && this.dir !== 'd';
      keys.s = Math.random() > 0.90 && this.dir !== 'u';
      keys.a = Math.random() > 0.90 && this.dir !== 'r';
      keys.d = Math.random() > 0.90 && this.dir !== 'l';
      idleKey = true;
    }

    //restart every so often if we're in demo mode
    if (this.sketch.t - this.lastKey > demoTime) {
      this.sketch.restart = true;
    }

    //handle key presses
    if (keys.w) {
      const movex = Math.round(this.x + this.dirMoveMap.u[0]);
      const movey = Math.round(this.y + this.dirMoveMap.u[1]);
      if (this.sketch.board[movey][movex] === ' ') {
        this.dir = 'u';
      }
      this.lastKey = idleKey ? this.lastKey : this.sketch.t;
    } 
    if (keys.s) {
      const movex = Math.round(this.x + this.dirMoveMap.d[0]);
      const movey = Math.round(this.y + this.dirMoveMap.d[1]);
      if (this.sketch.board[movey][movex] === ' ') {
        this.dir = 'd';
      }
      this.lastKey = idleKey ? this.lastKey : this.sketch.t;
    } 
    if (keys.a) {
      const movex = Math.round(this.x + this.dirMoveMap.l[0]);
      const movey = Math.round(this.y + this.dirMoveMap.l[1]);
      if (this.sketch.board[movey][movex] === ' ') {
        this.dir = 'l';
      }
      this.lastKey = idleKey ? this.lastKey : this.sketch.t;
    } 
    if (keys.d) {
      const movex = Math.round(this.x + this.dirMoveMap.r[0]);
      const movey = Math.round(this.y + this.dirMoveMap.r[1]);
      if (this.sketch.board[movey][movex] === ' ') {
        this.dir = 'r';
      }
      this.lastKey = idleKey ? this.lastKey : this.sketch.t;
    }


    //eat pellets
    this.sketch.pellets.forEach( p => {
      if (p.x === gridX && p.y === gridY && p.eaten === false) {
        p.eaten = true;
        this.eatCount++;
        this.score += (this.length + 1) * (p.power ? 1000 : 10);
        if (p.power) {
          this.powered = true;
          this.powerEnd = this.sketch.t + 10;
        }
        this.tailSize += 0.1;
      }
    });

    //end power mode if timeout
    if (this.sketch.t > this.powerEnd) {
      this.powered = false;
    }

    //interact with ghosts
    this.sketch.ghosts.forEach( g => {
      const dx = this.x - g.x;
      const dy = this.y - g.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 0.7 * 0.7) {
        if (this.powered) {
          g.alive = false;
          this.score += (this.length + 1) * 10000;
          this.tailSize += 1;
        } else {
          this.die();
        }
      }
    });

    //die if hit by bullet
    this.sketch.bullets.forEach( b => {
      const dx = this.x - b.x;
      const dy = this.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 0.7 * 0.7) {
        if (this.powered) {
          b.alive = false;
          this.score += (this.length + 1) * 100;
          this.tailSize += 1;
        } else {
          this.die();
        }
      }
    });

    //add more tail if necessary
    while (this.tailSize >= 1) {
      this.tailSize -= 1;
      this.length++;
      if (this.tail === undefined) {
        this.tail = new Sketch10Tail(this.sketch, this);
      } else {
        this.tail.addTail();
      }
    }

    if (this.tail !== undefined) {
      this.tail.update();
    }

    //die if hit tail
    let curTail = this.tail;
    while (curTail !== undefined) {
      const dx = this.x - curTail.x;
      const dy = this.y - curTail.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 0.7 * 0.7 && !this.powered) {
        this.die();
      }

      curTail = curTail.tail;
    }

  }

  die() {
    this.x = this.startx;
    this.y = this.starty;
    this.dir = this.startdir;
    this.length = 0;
    if (this.tail !== undefined) {
      this.tail.die();
    }
    this.tail = undefined;
    this.powered = false;
    this.powerEnd = -1;
    this.dead = true;
    this.tailSize = 0;
    this.trail = [];
    for (let i = 0; i < 7; i++) {
      this.trail.push({x: this.x, y: this.y});
    }

    this.sketch.ghosts = [];
    this.sketch.bullets = [];
  }

  draw(ctx, scale, t) {
    const maxOpen = Math.PI / 2;
    const curOpen = maxOpen / 2 + (maxOpen / 2) * Math.sin(t * 24);

    const poweredFractionRemaining = (this.powerEnd - t) / 10;
    const flashRate = poweredFractionRemaining > 0.25 ? 0 : 200;
    const colorIndex = this.powered ? Math.round(0.5 + 0.5 * Math.cos(poweredFractionRemaining * flashRate)) : 0;
    ctx.fillStyle = ['yellow', 'blue'][colorIndex];
    ctx.save();
    ctx.translate((this.x + 0.5) * scale, (this.y + 0.5) * scale);
    ctx.rotate(this.dirAngleMap[this.dir]);
    ctx.beginPath();
    ctx.arc(0, 0, scale * 0.7, Math.PI + curOpen / 2, Math.PI * 2 + Math.PI / 8);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, scale * 0.7, - Math.PI / 8, Math.PI - curOpen / 2);
    ctx.fill();
    ctx.restore();

    if (this.tail !== undefined) {
      this.tail.draw(ctx, scale, t);
    }
  }
}

class Sketch10Ghost {
  constructor(sketch, x, y, dir) {
    this.sketch = sketch;
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.alive = true;
    this.dirAngleMap = {
      l: 0,
      r: Math.PI,
      u: Math.PI / 2,
      d: -Math.PI / 2
    };
    this.dirMoveMap = {
      l: [-1, 0],
      r: [1, 0],
      u: [0, -1],
      d: [0, 1]
    };
    this.dirCheckAdd = {
      l: [0, 0],
      r: [1, 0],
      u: [0, 0],
      d: [0, 1]
    }
  }

  update() {
    const move = this.dirMoveMap[this.dir];
    const speed = 0.1;
    const newX = this.x + move[0] * speed;
    const newY = this.y + move[1] * speed;
    const dirCheck = this.dirCheckAdd[this.dir];
    const gridX = Math.floor(newX + dirCheck[0]);
    const gridY = Math.floor(newY + dirCheck[1]);
    const testCell = this.sketch.board[gridY][gridX];
    //don't move onto the player tail
    let curTail = this.sketch.player.tail;
    let tailHit = false;
    while (curTail !== undefined) {
      const dx = newX - curTail.x;
      const dy = newY - curTail.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 0.7 * 0.7) {
        tailHit = true;
      }
      
      curTail = curTail.tail;
    }

    if ((testCell === ' ' || testCell === 'g') && !tailHit) {
      this.x = newX;
      this.y = newY;
      if (this.dir === 'l' || this.dir === 'r') {
        this.y = Math.round(this.y);
      }
      if (this.dir === 'u' || this.dir === 'd') {
        this.x = Math.round(this.x);
      }
    } else {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
    }

    if (this.x < 0.2 && this.y === 14 && this.dir === 'l') {
      this.x = 27;
    }
    if (this.x > 26.8 && this.y === 14 && this.dir === 'r') {
      this.x = 0;
    }

    const keys = {};
    //select a random key that isn't just moving backwards
    keys.w = Math.random() > 0.98 && this.dir !== 'd';
    keys.s = Math.random() > 0.98 && this.dir !== 'u';
    keys.a = Math.random() > 0.98 && this.dir !== 'r';
    keys.d = Math.random() > 0.98 && this.dir !== 'l';
    if (tailHit) {
      const reverse = {
        l: 'd',
        r: 'a',
        u: 's',
        d: 'w'
      };
      keys[reverse[this.dir]] = true;
    }

    if (keys.w) {
      const movex = Math.round(this.x + this.dirMoveMap.u[0]);
      const movey = Math.round(this.y + this.dirMoveMap.u[1]);
      if (this.sketch.board[movey][movex] === ' ') {
        this.dir = 'u';
      }
    } 
    if (keys.s) {
      const movex = Math.round(this.x + this.dirMoveMap.d[0]);
      const movey = Math.round(this.y + this.dirMoveMap.d[1]);
      if (this.sketch.board[movey][movex] === ' ') {
        this.dir = 'd';
      }
    } 
    if (keys.a) {
      const movex = Math.round(this.x + this.dirMoveMap.l[0]);
      const movey = Math.round(this.y + this.dirMoveMap.l[1]);
      if (this.sketch.board[movey][movex] === ' ') {
        this.dir = 'l';
      }
    } 
    if (keys.d) {
      const movex = Math.round(this.x + this.dirMoveMap.r[0]);
      const movey = Math.round(this.y + this.dirMoveMap.r[1]);
      if (this.sketch.board[movey][movex] === ' ') {
        this.dir = 'r';
      }
    }

    //fire a bullet
    if (Math.random() > 0.99) {
      this.sketch.bullets.push(new Sketch10Bullet(this.sketch, Math.floor(this.x), this.y));
    }
  }

  draw(ctx, scale, t) {
    const poweredFractionRemaining = (this.sketch.player.powerEnd - t) / 10;
    const flashRate = poweredFractionRemaining > 0.25 ? 0 : 200;
    const spriteIndex = this.sketch.player.powered ? Math.round(0.5 + 0.5 * Math.cos(poweredFractionRemaining * flashRate)) : 0;
    const timeIndex = Math.floor(t % 2);
    const sx = spriteIndex * scale * 1.5;
    const sy = timeIndex * 16 * 1.5;
    const swidth = scale * 1.5;
    const sheight = scale * 1.5;
    const dx = this.x * scale - 2;
    const dy = this.y * scale - 2;
    const dwidth = scale * 1.5;
    const dheight = scale * 1.5;
    ctx.drawImage(this.sketch.ghostSprite, sx, sy, swidth, sheight, dx, dy, dwidth, dheight);
  }
}

class Sketch10Bullet {
  constructor(sketch, x, y) {
    this.sketch = sketch;
    this.x = x;
    this.y = y;
    this.alive = true;
    this.dirMoveMap = {
      l: [-1, 0],
      r: [1, 0],
      u: [0, -1],
      d: [0, 1]
    };
    this.dirCheckAdd = {
      l: [0, 0],
      r: [1, 0],
      u: [0, 0],
      d: [0, 1]
    }
  }
  
  update() {
    //bullets only go down
    const move = this.dirMoveMap.d;
    const speed = 0.2;
    const newX = this.x + move[0] * speed;
    const newY = this.y + move[1] * speed;
    const dirCheck = this.dirCheckAdd.d;
    const gridX = Math.floor(newX + dirCheck[0]);
    const gridY = Math.floor(newY + dirCheck[1]);
    const testCell = this.sketch.board[gridY][gridX];
    //don't move onto the player tail
    let curTail = this.sketch.player.tail;
    let tailHit = false;
    while (curTail !== undefined) {
      const dx = newX - curTail.x;
      const dy = newY - curTail.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 0.7 * 0.7) {
        this.alive = false;
      }
      
      curTail = curTail.tail;
    }

    if ((testCell === ' ' || testCell === 'g') && !tailHit) {
      this.x = newX;
      this.y = newY;
      if (this.dir === 'l' || this.dir === 'r') {
        this.y = Math.round(this.y);
      }
      if (this.dir === 'u' || this.dir === 'd') {
        this.x = Math.round(this.x);
      }
    } else {
      this.alive = false;
    }
  }

  draw(ctx, scale, t) {
    const poweredFractionRemaining = (this.sketch.player.powerEnd - t) / 10;
    const flashRate = poweredFractionRemaining > 0.25 ? 0 : 200;
    const colorIndex = this.sketch.player.powered ? Math.round(0.5 + 0.5 * Math.cos(poweredFractionRemaining * flashRate)) : 0;
    ctx.fillStyle = ['white', 'blue'][colorIndex];
    const width = 3;
    const height = 9;
    ctx.fillRect((this.x + 0.5) * scale - width / 2, (this.y + 0.5) * scale - height / 2, width, height);
  }

}

class Sketch10Pellet {
  constructor(sketch, x, y, power) {
    this.sketch = sketch;
    this.x = x;
    this.y = y;
    this.power = power;
    this.eaten = false;
  }

  update() {}

  draw(ctx, scale, t) {
    if (this.eaten) {return;}
    const r = this.power ? 0.5 : 0.12;
    ctx.beginPath();
    ctx.arc((this.x + 0.5) * scale, (this.y + 0.5) * scale, r * scale, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Sketch10 extends Sketch {
  constructor() {
    super();
    this.scale = 16;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;
    this.initGhostSprite();
  }

  initGhostSprite() {
    //create the sprites on another canvas to reduce drawing time
    //normalWhite normalBlue
    //alterWhite  alterBlue
    this.ghostSprite = document.createElement('canvas');
    this.ghostSprite.width = this.scale * 1.5 * 2;
    this.ghostSprite.height = this.scale * 1.5 * 2;
    const ctx = this.ghostSprite.getContext('2d');
    //sprite is 11 x 8
    const sprite = [
      'X.x.....x.X.....'.split``,
      '...x...x........'.split``,
      '..xxxxxxx.......'.split``,
      '.xx.xxx.xx......'.split``,
      'xxxxxxxxxxx.....'.split``,
      'x.xxxxxxx.x.....'.split``,
      'x.x.....x.x.....'.split``,
      'X..xx.xx..X.....'.split``,
      'X.x.....x.X.....'.split``,
      'x..x...x..x.....'.split``,
      'x.xxxxxxx.x.....'.split``,
      'xxx.xxx.xxx.....'.split``,
      '.xxxxxxxxx......'.split``,
      '..xxxxxxx.......'.split``,
      '..x.....x.......'.split``,
      'Xx.......xX.....'.split``,
    ];
    //draw sprite array onto canvas
    const f = 2;
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 8; y++) {
        if (sprite[y][x] === 'x') {
          ctx.fillStyle = 'white';
          ctx.fillRect(x * f, y * f, f, f);
          ctx.fillStyle = 'blue';
          ctx.fillRect(x * f + this.scale * 1.5, y * f, f, f);
        }
        if (sprite[y + 8][x] === 'x') {
          const dy = 12;
          ctx.fillStyle = 'white';
          ctx.fillRect(x * f, (dy + y) * f, f, f);
          ctx.fillStyle = 'blue';
          ctx.fillRect(x * f + this.scale * 1.5, (dy + y) * f, f, f);
        }
      }
    }
  }

  load() {
    super.load();
    this.resetTime = Infinity;
    this.restart = false;
    this.won = false;
    this.ghosts = [];
    this.bullets = [];

    this.player = new Sketch10Player(this, 13.5, 23, 'l');

    //define the board layout
    this.board = [
    'R============QW============('.split``,
    'H            ||            H'.split``,
    'H r--9 r---9 || r---9 r--9 H'.split``,
    'H |##| |###| || |###| |##| H'.split``,
    'H l--j l---j lj l---j l--j H'.split``,
    'H                          H'.split``,
    'H r--9 r9 r------9 r9 r--9 H'.split``,
    'H l--j || l--9r--j || l--j H'.split``,
    'H      ||    ||    ||      H'.split``,
    'L====( |l--9 || r--j| R====J'.split``,
    '#####H |r--j lj l--9| H#####'.split``,
    '#####H ||          || H#####'.split``,
    '#####H || R==gg==( || H#####'.split``,
    '=====J lj H##gg##H lj L====='.split``,
    '          H######H          '.split``,
    '=====( r9 H######H r9 R====='.split``,
    '#####H || L======J || H#####'.split``,
    '#####H ||          || H#####'.split``,
    '#####H || r------9 || H#####'.split``,
    'R====J lj l--9r--j lj L====('.split``,
    'H            ||            H'.split``,
    'H r--9 r---9 || r---9 r--9 H'.split``,
    'H l-9| l---j lj l---j |r-j H'.split``,
    'H   ||                ||   H'.split``,
    'A-9 || r9 r------9 r9 || r-Z'.split``,
    'S-j lj || l--9r--j || lj l-X'.split``,
    'H      ||    ||    ||      H'.split``,
    'H r----jl--9 || r--jl----9 H'.split``,
    'H l--------j lj l--------j H'.split``,
    'H                          H'.split``,
    'L==========================J'.split``
    ];

    //add pellets every empty square except those in the list
    this.pellets = [];
    const emptySquares = [
      '9,11', '10,11', '11,11', '12,11', '13,11', '14,11', '15,11', '16,11',
      '17,11', '18,11', '9,17', '10,17', '11,17', '12,17', '13,17', '14,17',
      '15,17', '16,17', '17,17', '18,17', '9,12', '9,13', '9,14', '9,15',
      '9,16', '18,12', '18,13', '18,14', '18,15', '18,16', '12,9', '12,10',
      '15,9', '15,10', '9,18', '9,19', '18,18', '18,19', '0,14', '1,14',
      '2,14', '3,14', '4,14', '5,14', '7,14', '8,14', '19,14', '20,14',
      '22,14', '23,14', '24,14', '25,14', '26,14', '27,14'
    ];
    const powerSquares = [
      '1,3', '26,3', '1,23', '26,23'
    ];
    for (let y = 0; y < this.board.length; y++) {
      const row = this.board[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell === ' ') {
          if (emptySquares.indexOf(`${x},${y}`) === -1) {
            const power = powerSquares.indexOf(`${x},${y}`) !== -1;
            this.pellets.push(new Sketch10Pellet(this, x, y, power));
          }
        }
      }
    }


  }

  update() {
    if (this.t > this.resetTime || this.restart) {
      this.load();
    }

    if (this.player.eatCount === this.pellets.length) {
      //game won
      if (!this.won) {
        this.resetTime = this.t + 5;
        this.won = true;
      }
      return;
    }

    this.bullets.forEach( b => {
      b.update();
    });

    this.player.update();

    this.ghosts.forEach( g => {
      g.update();
    });

    const maxGhosts = 8;
    if (this.ghosts.length < maxGhosts) {
      if (Math.random() > 0.98) {
        this.ghosts.push(new Sketch10Ghost(this, 13, 13, 'u'));
      }
    }
    
    //remove dead objects
    this.ghosts = this.ghosts.filter( g => g.alive );
    this.bullets = this.bullets.filter( b => b.alive );

  }

  drawBoard(ctx, width, height) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.beginPath();
    //draw board grid based on board array
    for (let y = 0; y < this.board.length; y++) {
      const row = this.board[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        switch (cell) {
          case '=': {
            ctx.moveTo(x * this.scale, (y + 0.33) * this.scale);
            ctx.lineTo((x + 1) * this.scale, (y + 0.33) * this.scale);
            ctx.moveTo(x * this.scale, (y + 0.67) * this.scale);
            ctx.lineTo((x + 1) * this.scale, (y + 0.67) * this.scale);
            break;;
          }
          case 'H': {
            ctx.moveTo((x + 0.33) * this.scale, y * this.scale);
            ctx.lineTo((x + 0.33) * this.scale, (y + 1) * this.scale);
            ctx.moveTo((x + 0.67) * this.scale, y * this.scale);
            ctx.lineTo((x + 0.67) * this.scale, (y + 1) * this.scale);
            break;
          }
          case 'R': {
            ctx.moveTo((x + 0.67) * this.scale, (y + 1) * this.scale);
            ctx.arc((x + 1) * this.scale, (y + 1) * this.scale, 0.33 * this.scale, Math.PI, 3 * Math.PI / 2);
            ctx.moveTo((x + 0.33) * this.scale, (y + 1) * this.scale);
            ctx.arc((x + 1) * this.scale, (y + 1) * this.scale, 0.67 * this.scale, Math.PI, 3 * Math.PI / 2);
            break;
          }
          case '(': {
            ctx.moveTo(x * this.scale, (y + 0.67) * this.scale);
            ctx.arc(x * this.scale, (y + 1) * this.scale, 0.33 * this.scale, 3 * Math.PI / 2, 2 * Math.PI);
            ctx.moveTo(x * this.scale, (y + 0.33) * this.scale);
            ctx.arc(x * this.scale, (y + 1) * this.scale, 0.67 * this.scale, 3 * Math.PI / 2, 2 * Math.PI);
            break;
          }
          case 'L': {
            ctx.moveTo((x + 0.67) * this.scale, y * this.scale);
            ctx.arc((x + 1) * this.scale, y * this.scale, 0.33 * this.scale, Math.PI, Math.PI / 2, true);
            ctx.moveTo((x + 0.33) * this.scale, y * this.scale);
            ctx.arc((x + 1) * this.scale, y * this.scale, 0.67 * this.scale, Math.PI, Math.PI / 2, true);
            break;
          }
          case 'J': {
            ctx.moveTo((x + 0.33) * this.scale, y * this.scale);
            ctx.arc(x * this.scale, y * this.scale, 0.33 * this.scale, 0, Math.PI / 2);
            ctx.moveTo((x + 0.67) * this.scale, y * this.scale);
            ctx.arc(x * this.scale, y * this.scale, 0.67 * this.scale, 0, Math.PI / 2);
            break;
          }
          case 'Q': {
            ctx.moveTo(x * this.scale, (y + 0.33) * this.scale);
            ctx.lineTo((x + 1) * this.scale, (y + 0.33) * this.scale);
            ctx.moveTo(x * this.scale, (y + 0.67) * this.scale);
            ctx.arc((x + 0.18) * this.scale, (y + 1) * this.scale, 0.33 * this.scale, 3 * Math.PI / 2, 2 * Math.PI);
            break;
          }
          case 'W': {
            ctx.moveTo(x * this.scale, (y + 0.33) * this.scale);
            ctx.lineTo((x + 1) * this.scale, (y + 0.33) * this.scale);
            ctx.moveTo((x + 1) * this.scale, (y + 0.67) * this.scale);
            ctx.arc((x + 0.82) * this.scale, (y + 1) * this.scale, 0.33 * this.scale, 3 * Math.PI / 2, Math.PI, true);
            break;
          }
          case 'A': {
            ctx.moveTo((x + 0.33) * this.scale, y * this.scale);
            ctx.lineTo((x + 0.33) * this.scale, (y + 1) * this.scale);
            ctx.moveTo((x + 0.67) * this.scale, y * this.scale);
            ctx.arc((x + 1) * this.scale, (y + 0.18) * this.scale, 0.33 * this.scale, Math.PI, Math.PI / 2, true);
            break;
          }
          case 'S': {
            ctx.moveTo((x + 0.33) * this.scale, y * this.scale);
            ctx.lineTo((x + 0.33) * this.scale, (y + 1) * this.scale);
            ctx.moveTo((x + 0.67) * this.scale, (y + 1) * this.scale);
            ctx.arc((x + 1) * this.scale, (y + 0.82) * this.scale, 0.33 * this.scale, Math.PI, 3 * Math.PI / 2);
            break;
          }
          case 'Z': {
            ctx.moveTo((x + 0.67) * this.scale, y * this.scale);
            ctx.lineTo((x + 0.67) * this.scale, (y + 1) * this.scale);
            ctx.moveTo((x + 0.33) * this.scale, y * this.scale);
            ctx.arc(x * this.scale, (y + 0.18) * this.scale, 0.33 * this.scale, 0, Math.PI / 2);
            break;
          }
          case 'X': {
            ctx.moveTo((x + 0.67) * this.scale, y * this.scale);
            ctx.lineTo((x + 0.67) * this.scale, (y + 1) * this.scale);
            ctx.moveTo((x + 0.33) * this.scale, (y + 1) * this.scale);
            ctx.arc(x * this.scale, (y + 0.82) * this.scale, 0.33 * this.scale, 0, 3 * Math.PI / 2, true);
            break;
          }
          case '-': {
            ctx.moveTo(x * this.scale, (y + 0.5) * this.scale);
            ctx.lineTo((x + 1) * this.scale, (y + 0.5) * this.scale);
            break;
          }
          case '|': {
            ctx.moveTo((x + 0.5) * this.scale, y * this.scale);
            ctx.lineTo((x + 0.5) * this.scale, (y + 1) * this.scale);
            break;
          }
          case 'r': {
            ctx.moveTo((x + 0.5) * this.scale, (y + 1) * this.scale);
            ctx.arc((x + 1) * this.scale, (y + 1) * this.scale, 0.5 * this.scale, Math.PI, 3 * Math.PI / 2);
            break;
          }
          case '9': {
            ctx.moveTo(x * this.scale, (y + 0.5) * this.scale);
            ctx.arc(x * this.scale, (y + 1) * this.scale, 0.5 * this.scale, 3 * Math.PI / 2, 2 * Math.PI);
            break;
          }
          case 'l': {
            ctx.moveTo((x + 0.5) * this.scale, y * this.scale);
            ctx.arc((x + 1) * this.scale, y * this.scale, 0.5 * this.scale, Math.PI, Math.PI / 2, true);
            break;
          }
          case 'j': {
            ctx.moveTo((x + 0.5) * this.scale, y * this.scale);
            ctx.arc(x * this.scale, y * this.scale, 0.5 * this.scale, 0, Math.PI / 2);
            break;
          }
          case 'g': {
            //this space draws as empty but looks non-empty to prevent player from trying to enter
            break;
          }
          case '#': {
            //this space draws as empty but looks non-empty to prevent anything from trying to enter
            break;
          }
          default: {
          }
        }
      }
    }
    ctx.stroke();
  }

  draw(ctx, width, height, t, mousePoint) {
    this.drawBoard(ctx, width, height);
 
    //set the fill style here to improve performance
    ctx.fillStyle = 'white';
    this.pellets.forEach( o => {
      o.draw(ctx, this.scale, t);
    });

    this.ghosts.forEach( g => {
      g.draw(ctx, this.scale, t);
    });

    this.player.draw(ctx, this.scale, t);

    this.bullets.forEach( b => {
      b.draw(ctx, this.scale, t);
    });

    //draw score
    ctx.fillStyle = 'white';
    ctx.font = '15px Arial Black';
    ctx.fillText(`SCORE: ${this.player.score}`, 10, 508);

    //draw win msg
    if (this.won) {
      ctx.font = '90px Arial Black';
      ctx.fillText('WINNER!', 5, 200);
    }
  }
}

app.sketches[10] = new Sketch10();
app.sketches[10].desc = `Nostalgia is a weird emotion. Feel it with wasd.`;
