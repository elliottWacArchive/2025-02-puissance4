class Puissance4 {
    constructor(sizeX = 7, sizeY = 6, color1 = 'yellow', color2 = 'red') {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.color1 = color1;
        this.color2 = color2;
        this.turn = 1;
        this.npiece = 0;
        this.userSize = this.init(this.sizeX, this.sizeY + 1);
        this.makeGrid(this.sizeX, this.sizeY);
        this.startGame();
    }

    init(sizeX, sizeY) {
        const percentX = 100 / sizeX;
        const percentY = 100 / sizeY;
        const result = document.createElement('div');
        result.className = 'result-container';
        result.innerHTML = `<div class=${this.color1}>${this.color1}<div class='result'>0</div></div>-<div class=${this.color2}>${this.color2}<div class='result'>0</div><button id="undo">Undo</button></div>`;
        document.body.appendChild(result);
        let data;
        let userSize;
        if (sizeX >= sizeY) {
            data = `.cellule { width: calc(${percentX}% - 2px); aspect-ratio: 1/1; }`;
            userSize = percentX;
        } else {
            data = `.row { height: ${percentY}%; } .cellule { height: 100%; aspect-ratio: 1/1; }`;
            userSize = percentY;
        }
        const style = document.createElement('style');
        style.innerHTML = data;
        document.head.innerHTML += "<link rel='stylesheet' href='module/style.css'>";
        document.head.appendChild(style);
        const container = "<div class='grid-container'></div>";
        document.body.innerHTML += container;
        document.getElementById("undo").addEventListener('click', () => {
            const lastPiece = document.querySelector(`.piece.p${this.npiece}`);
            if (lastPiece) {
                lastPiece.remove();
                this.npiece--;
                this.turn = this.turn === 1 ? 2 : 1;
            }
        });
        return userSize;
    }

    makeGrid(sizeX, sizeY) {
        const grid = document.getElementsByClassName("grid-container")[0];
        for (let y = 0; y <= sizeY; y++) {
            if (y == 0) {
                grid.innerHTML += `<div class="row selector-container" id="y${y}"></div>`;
            } else {
                grid.innerHTML += `<div class="row" id="y${y}"></div>`;
            }
            let row = document.getElementById(`y${y}`);
            for (let x = 0; x < sizeX; x++) {
                if (y == 0) {
                    row.innerHTML += `<div class="cellule selector" id="x${x}"></div>`;
                } else {
                    row.innerHTML += `<div class="cellule" id="x${x}"></div>`;
                }
            }
        }
    }

    checkNull() {
        let count = 0;
        for (let y = 1; y <= this.sizeY; y++) {
            for (let x = 0; x < this.sizeX; x++) {
                let cell = document.getElementById(`y${y}`).querySelector(`#x${x}`);
                if (cell.children.length > 0) {
                    count++;
                }
            }
        }
        if (count == this.sizeX * this.sizeY) {
            const selector = document.querySelector('.selector-container');
            selector.style.height = 100 + '%';
            selector.innerHTML = `<div class="win">Partie Nulle! <button id="replay">Replay</button></div>`;
            document.getElementById('replay').addEventListener('click', () => {
                this.replay();
            });
        }
    }

    checkWin() {
        const grid = [];
        for (let y = 1; y <= this.sizeY; y++) {
            let row = [];
            for (let x = 0; x < this.sizeX; x++) {
                let cell = document.getElementById(`y${y}`).querySelector(`#x${x}`);
                if (cell.children.length > 0) {
                    row.push(cell.children[0].style.backgroundColor);
                } else {
                    row.push(null);
                }
            }
            grid.push(row);
        }

        const checkDirection = (dx, dy) => {
            for (let y = 0; y < this.sizeY; y++) {
                for (let x = 0; x < this.sizeX; x++) {
                    let color = grid[y][x];
                    if (color) {
                        let win = true;
                        for (let i = 1; i < 4; i++) {
                            let nx = x + dx * i;
                            let ny = y + dy * i;
                            if (nx < 0 || ny < 0 || nx >= this.sizeX || ny >= this.sizeY || grid[ny][nx] !== color) {
                                win = false;
                                break;
                            }
                        }
                        if (win) {
                            document.querySelector(`.${color}`).querySelector('.result').innerHTML = parseInt(document.querySelector(`.${color}`).querySelector('.result').innerHTML) + 1;
                            const selector = document.querySelector('.selector-container');
                            selector.style.height = 100 + '%';
                            selector.innerHTML = `<div class="win">${color} a gagné! <button id="replay">Replay</button></div>`;
                            document.getElementById('replay').addEventListener('click', () => {
                                this.replay();
                            });
                            return true;
                        } else {
                            this.checkNull();
                        }
                    }
                }
            }
            return false;
        };
        return checkDirection(1, 0) || checkDirection(0, 1) || checkDirection(1, 1) || checkDirection(1, -1);
    }

    replay() {
        document.querySelector('.grid-container').innerHTML = '';
        this.makeGrid(this.sizeX, this.sizeY);
        this.startGame();
        this.turn = 1;
        this.npiece = 0;
    }

    startGame() {
        document.querySelectorAll('.selector').forEach(item => {
            item.addEventListener('click', (e) => {
                let column = item.id.slice(1);
                const div = document.createElement('div');
                if (this.turn == 1) {
                    div.style.backgroundColor = this.color1;
                    if (document.getElementById('y1').querySelector(`#x${column}`).children.length > 0) {
                        this.turn = 1;
                    } else {
                        this.turn = 2;
                    }
                }
                else {
                    div.style.backgroundColor = this.color2;
                    if (document.getElementById('y1').querySelector(`#x${column}`).children.length > 0) {
                        this.turn = 2;
                    } else {
                        this.turn = 1;
                    }
                }
                this.npiece++;
                div.className = `piece p${this.npiece}`;
                div.style.width = "100%";
                div.style.height = "100%";
                div.style.borderRadius = "50%";
                item.appendChild(div);
                this.newPosition(div, 1, column);
                setTimeout(() => {
                    this.checkWin();
                }, 25 * this.sizeY);
            });
        });
    }

    newPosition(item, n, x) {
        let row = document.getElementById(`y${n-1}`);
        let nextRow = document.getElementById(`y${n}`);
        if (nextRow != null) {
            let column = row.querySelector(`#x${x}`);
            let nextColumn = nextRow.querySelector(`#x${x}`);
            if (nextColumn.children.length === 0) {
                column.removeChild(item);
                nextColumn.appendChild(item);
                setTimeout(() => {
                    this.newPosition(item, n+1, x);
                }, 25);
            } else if (n == 1) {
                column.removeChild(item);
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
}

export { Puissance4 };
