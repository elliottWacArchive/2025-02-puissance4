class Puissance4 {
    constructor(sizeX = 7, sizeY = 6, color1 = 'yellow', color2 = 'red') {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.color1 = color1;
        this.color2 = color2;
        this.init();
        this.userSize = this.makeGrid(this.sizeX, this.sizeY);
    }

    init() {
        const importCss = "<link rel='stylesheet' href='module/style.css'>";
        document.head.innerHTML += importCss;
        const container = "<div class='grid-container'><div class='row' id='selector'></div>";
        document.body.innerHTML += container;
    }

    makeGrid(sizeX, sizeY) {
        const grid = document.getElementsByClassName("grid-container")[0];
        for (let y = 0; y < sizeY; y++) {
            grid.innerHTML += `<div class="row" id="y${y}"></div>`;
            let row = document.getElementById(`y${y}`);
            for (let x = 0; x < sizeX; x++) {
                row.innerHTML += `<div class="cellule" id="x${x}"></div>`;
            }
        }
    }
}

export { Puissance4 };