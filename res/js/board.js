let tileSize = 36;
let boardXCount = 20;
let boardYCount = 20;

function drawBoard(tileSize,boardXCount,boardYCount){

    let boardWidth = tileSize * boardXCount;
    let boardHeight = tileSize * boardYCount;    

    document.querySelector("#board-container").style.width = `${boardWidth + 2 * boardXCount + 25}px`;

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
            cell.style.padding = 1;
            cell.innerHTML = `<img src='./res/img/hidden_tile.png' width=${tileSize}px height=${tileSize}px>`;
        }
    }
    document.querySelector("#board-container").appendChild(table);
}

drawBoard(tileSize,boardXCount,boardYCount);