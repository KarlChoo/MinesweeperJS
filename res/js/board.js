let tileSize = 24;
let boardXCount = 20;
let boardYCount = 20;

let hiddenTile = `<img src='./res/img/hidden_tile.png' width=${tileSize}px height=${tileSize}px>`;
let revealedTile = `<img src='./res/img/reveal_tile.png' width=${tileSize}px height=${tileSize}px>`;
let mineTile = `<img src='./res/img/mine_tile.png' width=${tileSize}px height=${tileSize}px>`;
let mineTileClicked = `<img src='./res/img/mine_tile_clicked.png' width=${tileSize}px height=${tileSize}px>`;
let flaggedTile = `<img src='./res/img/flaged_tile.png' width=${tileSize}px height=${tileSize}px>`;
let oneTile = `<img src='./res/img/1_tile.png' width=${tileSize}px height=${tileSize}px>`;
let twoTile = `<img src='./res/img/2_tile.png' width=${tileSize}px height=${tileSize}px>`;
let threeTile = `<img src='./res/img/3_tile.png' width=${tileSize}px height=${tileSize}px>`;
let fourTile = `<img src='./res/img/4_tile.png' width=${tileSize}px height=${tileSize}px>`;
let fiveTile = `<img src='./res/img/5_tile.png' width=${tileSize}px height=${tileSize}px>`;
let sixTile = `<img src='./res/img/6_tile.png' width=${tileSize}px height=${tileSize}px>`;
let sevenTile = `<img src='./res/img/7_tile.png' width=${tileSize}px height=${tileSize}px>`;
let eightTile = `<img src='./res/img/8_tile.png' width=${tileSize}px height=${tileSize}px>`;
/**
 * 
 * setTileImage funtion code
 * oneTile = 1
 * twoTile = 2
 * threeTile = 3
 * fourTile = 4
 * fiveTile = 5
 * sixTile = 6
 * sevenTile = 7
 * eightTile = 8
 * hiddenTile = 11
 * revealedTile = 12
 * mineTile = 13
 * mineTileClicked = 14
 * flaggedTile = 15
 * 
 */

const TILE_IMG = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    HIDDEN: 11,
    REVEALED: 12,
    MINE: 13,
    MINE_CLICKED: 14,
    FLAG: 15
}



function drawBoard(tileSize,boardXCount,boardYCount){

    let boardWidth = tileSize * boardXCount;
    let boardHeight = tileSize * boardYCount;    

    document.querySelector("#board-container").style.width = `${510}px`;
    document.querySelector("#board-container").style.height = `${545}px`;

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
            //cell.innerHTML = hiddenTile;
            setTileImage(cell, TILE_IMG.HIDDEN);
            /*
                cell.addEventListener("click", event => {
                    cell.innerHTML = revealedTile;
                })
            */
        }
    }
    document.querySelector("#board-container").appendChild(table);
}

function setTileImage(tile, num){
    switch(num){
        case 1: tile.innerHTML = oneTile;
                break;
        case 2: tile.innerHTML = twoTile;
                break;
        case 3: tile.innerHTML = threeTile;
                break;
        case 4: tile.innerHTML = fourTile;
                break;
        case 5: tile.innerHTML = fiveTile;
                break;
        case 6: tile.innerHTML = sixTile;
                break;
        case 7: tile.innerHTML = sevenTile;
                break;
        case 8: tile.innerHTML = eightTile;
                break;
        case 11: tile.innerHTML = hiddenTile;
                break;
        case 12: tile.innerHTML = revealedTile;
                break;
        case 13: tile.innerHTML = mineTile;
                break;
        case 14: tile.innerHTML = mineTileClicked;
                break;
        case 15: tile.innerHTML = flaggedTile;
                break;
        default: console.log("Invalid tile");
    }
    
}

drawBoard(tileSize,boardXCount,boardYCount);