let tileSize = 24;
let boardXCount = 20;
let boardYCount = 20;

let hiddenTile = `<img src='./res/img/hidden_tile.png' width=${tileSize}px height=${tileSize}px>`;
let revealedTile = `<img src='./res/img/reveal_tile.png' width=${tileSize}px height=${tileSize}px>`;
let mineTile = `<img src='./res/img/mine_tile.png' width=${tileSize}px height=${tileSize}px>`;
let mineTileClicked = `<img src='./res/img/mine_tile_clicked.png' width=${tileSize}px height=${tileSize}px>`;
let flaggedTile = `<img src='./res/img/flaged_tile.png' width=${tileSize}px height=${tileSize}px>`;


function drawBoard(tileSize,boardXCount,boardYCount){

    let boardWidth = tileSize * boardXCount;
    let boardHeight = tileSize * boardYCount;    

    document.querySelector("#board-container").style.width = `${boardWidth + 2.5 * boardXCount}px`;
    document.querySelector("#board-container").style.height = `${boardWidth + 2.5 * boardYCount + 25}px`;

    let table = document.createElement("table");
    table.setAttribute("id","board");
    table.style.width = boardWidth;
    table.style.height = boardHeight;
    table.style.margin = 0;
    table.style.padding = 0;
    table.style.borderCollapse = "collapse";
    for(let i = 0; i < boardXCount; i++){
        let row = table.insertRow(i);
        for(let j = 0; j < boardYCount; j++){
            let cell = row.insertCell(j);
            cell.style.height = `${tileSize}px`;
            cell.style.width = `${tileSize}px`;
            cell.style.margin = 0;
            cell.style.padding = 0;
            cell.id = `t${i}_${j}`;
            cell.innerHTML = hiddenTile;
            /*
                cell.addEventListener("click", event => {
                    cell.innerHTML = revealedTile;
                })
            */
        }
    }
    document.querySelector("#board-container").appendChild(table);
}

drawBoard(tileSize,boardXCount,boardYCount);