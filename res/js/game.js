let board;
let boardVisual = document.querySelector("#board-container");

let minesweeperGame = {
    "status": 0, // 0 = none, 1 = win, 2 = lose
    ongoing: false
};

let logicBoard = [];
/*
 0 = SAFE TILE (HIDDEN)
 1 = MINED TILE (HIDDEN)
 3 = SAFE TILE (REVEALED)
 4 = MINED TILE (REVEALED)
 8 = FLAGGED TILE (SAFE)
 9 = FLAGGED TILE (MINE)
*/

let messageBox = document.querySelector("#message");
let startButton = document.querySelector("#startBtn");
let resetButton = document.querySelector("#resetBtn");

startButton.addEventListener("click",initLogicBoard);
resetButton.addEventListener("click",resetGame);

function initLogicBoard(){
    board = document.querySelector("#board");
    if(minesweeperGame.status !== 0){
        return;
    }

    if(minesweeperGame.ongoing){
        return;
    }

    let mineCount = document.getElementById("mineInput").value;

    if(mineCount > 0.7 * boardXCount * boardXCount){
        updateSystemMessaage("Can't have too many mines");
        return;
    }

    updateSystemMessaage("");

    for(let i = 0; i < boardXCount; i++){
        let row = [];
        for(let j = 0; j < boardYCount; j++){
            row.push(0);
        }
        logicBoard.push(row);
    }
    
    placeMines(mineCount);
    setTileClickEvent();
    console.log(logicBoard);
    minesweeperGame.status = 0;
    minesweeperGame.ongoing = true;
}

function placeMines(mineCount){
    let minesPlaced = 0;
    while(minesPlaced < mineCount){
        let rndX = Math.floor(Math.random() * boardXCount);
        let rndY = Math.floor(Math.random() * boardYCount);
        if(logicBoard[rndX][rndY] === 1){
            continue;
        }
        logicBoard[rndX][rndY] = 1;
        minesPlaced++;
    }
}

function idtoXYCoords(id){
    id = String(id);
    let x = parseInt(id.split("_")[0].substring(1));
    let y = parseInt(id.split("_")[1]);
    return {x: x, y: y}
}

function getTileFromCoords(x,y){
    let tileId = `t${x}_${y}`;
    return document.getElementById(tileId);
}

function setTileClickEvent(){
    
    let tiles = board.querySelectorAll("td");
    for(let i = 0;i < tiles.length; i++){
        let coords = idtoXYCoords(tiles[i].id);
        let logicBoardXCoords = coords.x
        let logicBoardYCoords = coords.y;
        //if(tiles[i].id){};
        //tiles[i].innerHTML = hiddenTile;
        setTileImage(tiles[i],TILE_IMG.HIDDEN);
        if(logicBoard[logicBoardXCoords][logicBoardYCoords] === 1){
            tiles[i].addEventListener("mousedown", event => {
            
                //If tile revealed
                if(logicBoard[logicBoardXCoords][logicBoardYCoords] !== 4  && minesweeperGame.status === 0) {
                    //If tile flagged
                    if(logicBoard[logicBoardXCoords][logicBoardYCoords] === 9) {
                        if (event.button == 2){
                            logicBoard[logicBoardXCoords][logicBoardYCoords] = 1;
                            //tiles[i].innerHTML = hiddenTile;
                            setTileImage(tiles[i],TILE_IMG.HIDDEN);
                        }
                        return;
                    }

                    //Reveal tile
                    if(event.button == 0){
                        logicBoard[logicBoardXCoords][logicBoardYCoords] = 4;
                        setTileImage(tiles[i],TILE_IMG.MINE_CLICKED);
                    }
                    else if (event.button == 2){ //Flag tile
                        logicBoard[logicBoardXCoords][logicBoardYCoords] = 9;
                        //tiles[i].innerHTML = flaggedTile;
                        setTileImage(tiles[i],TILE_IMG.FLAG);
                    }
                    checkGameStatus();
                }

                
            })
        } else if (logicBoard[logicBoardXCoords][logicBoardYCoords] === 0) {
            tiles[i].addEventListener("mousedown", event => {
                //If tile revealed
                if(logicBoard[logicBoardXCoords][logicBoardYCoords] !== 3 && minesweeperGame.status === 0) {
                    //If tile flagged
                    if(logicBoard[logicBoardXCoords][logicBoardYCoords] === 8) {
                        if (event.button == 2){
                            logicBoard[logicBoardXCoords][logicBoardYCoords] = 0;
                            //tiles[i].innerHTML = hiddenTile;
                            setTileImage(tiles[i],TILE_IMG.HIDDEN);
                        }
                        return;
                    }

                    //Reveal tile
                    if(event.button == 0){
                        logicBoard[logicBoardXCoords][logicBoardYCoords] = 3;
                        //tiles[i].innerHTML = revealedTile;
                        setTileImage(tiles[i],TILE_IMG.REVEALED);
                        let pendingNumTilelist = checkSurroundingTiles(tiles[i]);
                        pendingNumTilelist.forEach(numTile => {
                            setTileImage(numTile.tile,numTile.tileImgCode);
                        });
                    }
                    else if (event.button == 2){
                        logicBoard[logicBoardXCoords][logicBoardYCoords] = 8;
                        //tiles[i].innerHTML = flaggedTile;
                        setTileImage(tiles[i],TILE_IMG.FLAG);
                    }
                    checkGameStatus();
                }

            })
        }
        
    }

}

function checkGameStatus(){
    if(checkAllTiles(4)){
        minesweeperGame.status = 2;
    }

    if(!checkAllTiles(0)){
        minesweeperGame.status = 1;
    }

    switch(minesweeperGame.status){
        case 1: updateSystemMessaage("Game end. You won.");
                break;
        case 2: updateSystemMessaage("Game end. You lose.");
                break;
        default:
    }
}

function resetGame(){
    minesweeperGame.status = 0;
    minesweeperGame.ongoing = false;
    logicBoard = [];
    drawBoard(tileSize,boardXCount,boardYCount);
    initLogicBoard();
}

function checkAllTiles(tileStatus){
    for (let i = 0; i < logicBoard.length; i++) {
        if(logicBoard[i].includes(tileStatus)){
            return true;
        }
    }
    return false;
}

function checkSurroundingTiles(tile){
    let tileChecklist = [];
    let numTileList = [];
    let counter = 0;
    tileChecklist.push(tile);

    while(tileChecklist.length > counter){
        let coords = idtoXYCoords(tileChecklist[counter].id);
        let x = coords.x
        let y = coords.y; 

        if(logicBoard[x][y] === 1){
            tileChecklist.splice(counter,1);
            continue;
        }

        let noMinesSurrounding = 0;
        
        //Check W
        if(y - 1 >= 0){
            //logicBoard[x][y - 1] = "W";
            let tile = getTileFromCoords(x, y - 1);
            if(logicBoard[x][y - 1] === 1 || logicBoard[x][y - 1] === 9){
                noMinesSurrounding++;
            }
        }
        //Check E
        if(y + 1 < boardYCount){
            //logicBoard[x][y + 1] = "E";
            let tile = getTileFromCoords(x, y + 1);
            if(logicBoard[x + 1][y] === 1 || logicBoard[x + 1][y] === 9){
                noMinesSurrounding++;
            }
        }
        //Check S
        if(x + 1 < boardXCount){
            //logicBoard[x + 1][y] = "S";
            let tile = getTileFromCoords(x + 1, y);
            if(logicBoard[x + 1][y] === 1 || logicBoard[x + 1][y] === 1){
                noMinesSurrounding++;
            }
        }
        //Check N
        if(x - 1 >= 0){
            //logicBoard[x - 1][y] = "N";
            let tile = getTileFromCoords(x - 1, y);
            if(logicBoard[x - 1][y] === 1 || logicBoard[x - 1][y] === 9){
                noMinesSurrounding++;
            }
        }
        //Check SW
        if(y - 1 >= 0 && x + 1 < boardXCount){
            //logicBoard[x + 1][y - 1] = "SW";
            let tile = getTileFromCoords(x + 1, y - 1);
            if(logicBoard[x + 1][y - 1] === 1 || logicBoard[x + 1][y - 1] === 9){
                noMinesSurrounding++;
            }
        }
        //Check NW
        if(y - 1 >= 0 && x - 1 >= 0){
            //logicBoard[x - 1][y - 1] = "NW";
            let tile = getTileFromCoords(x - 1, y - 1);
            if(logicBoard[x - 1][y - 1] === 1 || logicBoard[x - 1][y - 1] === 9){
                noMinesSurrounding++;
            }
        }
        //Check SE
        if(y + 1 < boardYCount && x + 1 < boardXCount){
            //logicBoard[x + 1][y + 1] = "SE";
            let tile = getTileFromCoords(x + 1, y + 1);
            if(logicBoard[x + 1][y + 1] === 1 || logicBoard[x + 1][y + 1] === 9){
                noMinesSurrounding++;
            }
        }
        //Check NE
        if(y + 1 < boardYCount && x - 1 >= 0){
            //logicBoard[x - 1][y + 1] = "NE";
            let tile = getTileFromCoords(x - 1, y + 1)
            if(logicBoard[x - 1][y + 1] === 1 || logicBoard[x - 1][y + 1] === 9){
                noMinesSurrounding++;
            }
        }

        if(noMinesSurrounding === 0){
            numTileList.push({tile: tileChecklist[counter],tileImgCode: 12});

            //Check W
            if(y - 1 >= 0){
                let tile = getTileFromCoords(x, y - 1);
                if(!tileChecklist.includes(tile)){
                    tileChecklist.push(tile);
                }
            }

            //Check E
            if(y + 1 < boardYCount){
                let tile = getTileFromCoords(x, y + 1);
                if(!tileChecklist.includes(tile)){
                    tileChecklist.push(tile);
                }
            }

            //Check S
            if(x + 1 < boardXCount){
                let tile = getTileFromCoords(x + 1, y);
                if(!tileChecklist.includes(tile)){
                    tileChecklist.push(tile);
                }
            }

            //Check N
            if(x - 1 >= 0){
                let tile = getTileFromCoords(x - 1, y);
                if(!tileChecklist.includes(tile)){
                    tileChecklist.push(tile);
                }
            }

            //Check SW
            if(y - 1 >= 0 && x + 1 < boardXCount){
                let tile = getTileFromCoords(x + 1, y - 1);
                if(!tileChecklist.includes(tile)){
                    tileChecklist.push(tile);
                }
            }

            //Check NW
            if(y - 1 >= 0 && x - 1 >= 0){
                let tile = getTileFromCoords(x - 1, y - 1);
                if(!tileChecklist.includes(tile)){
                    tileChecklist.push(tile);
                }
            }

            //Check SE
            if(y + 1 < boardYCount && x + 1 < boardXCount){
                let tile = getTileFromCoords(x + 1, y + 1);
                if(!tileChecklist.includes(tile)){
                    tileChecklist.push(tile);
                }
            }

            //Check NE
            if(y + 1 < boardYCount && x - 1 >= 0){
                let tile = getTileFromCoords(x - 1, y + 1)
                if(!tileChecklist.includes(tile)){
                    tileChecklist.push(tile);
                }
            }

        }else{
            numTileList.push({tile: tileChecklist[counter],tileImgCode: noMinesSurrounding});
        }
        counter++;
    }
    console.log(numTileList);
    
    return numTileList;
}

function updateSystemMessaage(message){
    messageBox.innerHTML = message;
}

