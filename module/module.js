class Puissance4 {
    constructor(sizeX = 7, sizeY = 6, color1 = 'yellow', color2 = 'red') {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.color1 = color1;
        this.color2 = color2;
        this.turn = 1;
        this.userSize = this.init(this.sizeX, this.sizeY + 1);
        console.log(this.userSize);
        this.makeGrid(this.sizeX, this.sizeY);
        this.startGame();
    }

    init(sizeX, sizeY) {
        const percentX = 100 / sizeX;
        const percentY = 100 / sizeY;

        let data;
        let userSize;
        if (sizeX >= sizeY) {
            data = `.cellule { width: calc(${percentX}% - 2px); aspect-ratio: 1/1; }`;
            userSize = percentX;
        } else {
            data = `.row { height: ${percentY}%; } .cellule { aspect-ratio: 1/1; }`;
            userSize = percentY;
        }
        const style = document.createElement('style');
        style.innerHTML = data;
        document.head.innerHTML += "<link rel='stylesheet' href='module/style.css'>";
        document.head.appendChild(style);
        const container = "<div class='grid-container'></div>";
        document.body.innerHTML += container;
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
                div.className = 'piece';
                div.style.width = "100%";
                div.style.height = "100%";
                div.style.borderRadius = "50%";
                item.appendChild(div);
                this.newPosition(div, 1, column);
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