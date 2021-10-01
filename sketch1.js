'use strict';

class Sketch1 extends Sketch {
  constructor() {
    super();
    this.scale = 32;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;

    //possible directions
    this.sides = 'lrud'.split``;
    //opposite directions
    this.oppSide = {
      l: 'r',
      r: 'l',
      u: 'd',
      d: 'u'
    };
    //delta coords for side lines
    this.sideLines = {
      l: [[0, 0], [0, 1]],
      r: [[1, 0], [1, 1]],
      u: [[0, 0], [1, 0]],
      d: [[0, 1], [1, 1]]
    };
    //list of neighbor sides and delta coords
    this.neighbors = [
      {side: 'l', dx: -1, dy: 0},
      {side: 'r', dx: 1, dy: 0},
      {side: 'u', dx: 0, dy: -1},
      {side: 'd', dx: 0, dy: 1}
    ];
    //map of sides and delta coords
    this.moveDeltas = {
      l: [-1, 0],
      r: [1, 0],
      u: [0, -1],
      d: [0, 1]
    };

    this.initMaze();
  }

  //build a new maze
  initMaze() {
    //use iterative implementation from wikipedia Maze_generation_algorithm
    this.grid = [];
    for (let x = 0; x < this.width; x++) {
      const col = [];
      for (let y = 0; y < this.height; y++) {
        //store the coordinate, the status of wall on each side, if it's been visited during gen, and light level
        col.push({x, y, l: true, r: true, u: true, d: true, visited: false, light: 0});
      }
      this.grid.push(col);
    }

    const stack = [this.grid[0][0]];
    this.grid[0][0].visited = true;

    while (stack.length > 0) {
      const curCell = stack.pop();
      const unvisitedNeighbors = [];
      this.neighbors.forEach( n => {
        const nx = curCell.x + n.dx;
        const ny = curCell.y + n.dy;
        if (nx >= 0 && nx < this.width && ny >=0 && ny < this.height) {
          const ncell = this.grid[nx][ny];
          if (!ncell.visited) {
            unvisitedNeighbors.push({side: n.side, cell: ncell});
          }
        }
      });
      if (unvisitedNeighbors.length > 0) {
        const unvisitedIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
        const unvisitedCell = unvisitedNeighbors[unvisitedIndex];
        stack.push(curCell);
        const nside = unvisitedCell.side;
        curCell[nside] = false;
        unvisitedCell.cell[this.oppSide[nside]] = false;

        unvisitedCell.cell.visited = true;
        stack.push(unvisitedCell.cell);
      }
    }

    //init good and evil positions and last directions
    this.goodPos = {x: 0, y: 0, ld: 'n', nm: 0, mmt: 0.2, rmt: 0.5, lx: 0, ly: 0, st: 0, dt: 0};
    this.evilPos = {x: this.width - 1, y: this.height - 1, ld: 'n', nm: 0, mmt: 0.5, rmt: 4, 
      lx: this.width - 1, ly: this.height - 1, st: 0, dt: 0};
  }

  load() {
    super.load();
    this.initMaze();
  }

  update() {
    //if good and evil are at the same position
    if (this.goodPos.x === this.evilPos.x && this.goodPos.y === this.evilPos.y) {
      //"fight" for 3 seconds and then restart
      this.timeout = this.timeout === undefined ? this.t + 3 : this.timeout;
      if (this.t >= this.timeout) {
        this.timeout = undefined;
        this.initMaze();
      }
      return;
    }

    //move both characters
    [this.goodPos, this.evilPos].forEach( (c, i) => {
      const cell = this.grid[c.x][c.y];
      cell.light = 1;
     
      //only move if current time is >= next move time
      if (this.t < c.nm) {return;}
      c.dt = c.mmt + c.rmt * Math.random();
      c.st = this.t;
      c.nm = this.t + c.dt;
      
      const possibleMoveDirs = [];
      this.sides.forEach(s => {
        if (!cell[s]) {possibleMoveDirs.push(s);}
      });
      let moveDir;
      if (possibleMoveDirs.length === 1) {
        moveDir = possibleMoveDirs[0];
      } else {
        //take a direction that isn't moving to where we just came from
        while (true) {
          moveDir = possibleMoveDirs[Math.floor(Math.random() * possibleMoveDirs.length)];
          if (this.oppSide[moveDir] !== c.ld) {
            break;
          }
        }
      }

      c.ld = moveDir;
      c.lx = c.x;
      c.ly = c.y;
      c.x += this.moveDeltas[moveDir][0];
      c.y += this.moveDeltas[moveDir][1];
    });

    //fade light
    for (let x = 0; x < this.width; x++) {
      const col = this.grid[x];
      for (let y = 0; y < this.height; y++) {
        const cell = col[y];
        cell.light *= 0.995;
      }
    }

  }

  draw(ctx, width, height, t, mousePoint) {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    for (let x = 0; x < this.width; x++) {
      const col = this.grid[x];
      for (let y = 0; y < this.height; y++) {
        const cell = col[y];
        const l = cell.light * 80;
        //draw cell light
        ctx.fillStyle = `hsl(46, 100%, ${l}%)`;
        ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
        this.sides.forEach(s => {
          if (cell[s]) {
            const line = this.sideLines[s];
            //draw walls
            ctx.moveTo((x + line[0][0]) * this.scale, (y + line[0][1]) * this.scale);
            ctx.lineTo((x + line[1][0]) * this.scale, (y + line[1][1]) * this.scale);
          }
        });
      }
    }
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${this.scale * 0.6}px Arial`;
    //draw good and evil icons sliding between new and old positions
    const ex = this.evilPos.lx + (this.evilPos.x - this.evilPos.lx) * Math.min(this.evilPos.dt, this.t - this.evilPos.st) / this.evilPos.dt + 0.5;
    const ey = this.evilPos.ly + (this.evilPos.y - this.evilPos.ly) * Math.min(this.evilPos.dt, this.t - this.evilPos.st) / this.evilPos.dt + 0.5;
    const gx = this.goodPos.lx + (this.goodPos.x - this.goodPos.lx) * Math.min(this.goodPos.dt, this.t - this.goodPos.st) / this.goodPos.dt + 0.5;
    const gy = this.goodPos.ly + (this.goodPos.y - this.goodPos.ly) * Math.min(this.goodPos.dt, this.t - this.goodPos.st) / this.goodPos.dt + 0.5;

    ctx.fillText('\ud83d\udc41\ufe0f', ex * this.scale, ey * this.scale);
    ctx.fillText('\ud83d\udde1\ufe0f', gx * this.scale, gy * this.scale); 
  }
}

app.sketches[1] = new Sketch1();
app.sketches[1].desc = `Who knows what creatures lurk in dark passageways?`;
