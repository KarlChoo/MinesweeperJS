let board;
let boardVisual = document.querySelector("#board-container");
let logicBoard = [];
let mineCount;

let minesweeperGame = {
    "status": 0, // 0 = none, 1 = win, 2 = lose
    ongoing: false,
    difficulty: DIFFICULTY.EASY
};

let messageBox = document.querySelector("#message");
let startButton = document.querySelector("#startBtn");
let resetButton = document.querySelector("#resetBtn");

startButton.addEventListener("click",initLogicBoard);
resetButton.addEventListener("click",resetGame);


function initLogicBoard(){
    board = document.querySelector("#board");
    if(minesweeperGame.status !== 0 || minesweeperGame.ongoing){
        return;
    }

    mineCount = minesweeperGame.difficulty.mines;

    // mineCount = document.getElementById("mineInput").value;

    // if(mineCount > 0.7 * boardXCount * boardXCount){
    //     updateSystemMessaage("Can't have too many mines");
    //     return;
    // }

    for(let i = 0; i < boardXCount; i++){
        let row = [];
        for(let j = 0; j < boardYCount; j++){
            row.push({
                mineCountAround: 0,
                mined: false,
                revealed: false,
                flagged: false,
                x: i,
                y: j
            });
        }
        logicBoard.push(row);
    }

    updateSystemMessaage("");
    setMines(mineCount);
    countSurroundingMines();
    setTileClickEvent();
    minesweeperGame.status = 0;
    minesweeperGame.ongoing = true;
}

function setMines(mineCount){
    let minesPlaced = 0;
    while(minesPlaced < mineCount){
        let rndX = Math.floor(Math.random() * boardXCount);
        let rndY = Math.floor(Math.random() * boardYCount);
        if(logicBoard[rndX][rndY].mined){
            continue;
        }
        logicBoard[rndX][rndY].mined = true;
        minesPlaced++;
    }
}

function idtoXYCoords(id){
    id = String(id);
    let x = parseInt(id.split("_")[0].substring(1));
    let y = parseInt(id.split("_")[1]);
    return {x: x, y: y}
}

function countSurroundingMines(){
    for (let x = 0; x < logicBoard.length; x++) {
        for (let y = 0; y < logicBoard[x].length; y++) {
            let noMinesSurrounding = 0;
            //Check W
            if(y - 1 >= 0){
                if(logicBoard[x][y - 1].mined){
                    noMinesSurrounding++;
                }
            }
            //Check E
            if(y + 1 < boardYCount){
                if(logicBoard[x][y + 1].mined){
                    noMinesSurrounding++;
                }
            }
            //Check S
            if(x + 1 < boardXCount){
                if(logicBoard[x + 1][y].mined){
                    noMinesSurrounding++;
                }
            }
            //Check N
            if(x - 1 >= 0){
                if(logicBoard[x - 1][y].mined){
                    noMinesSurrounding++;
                }
            }
            //Check SW
            if(y - 1 >= 0 && x + 1 < boardXCount){
                if(logicBoard[x + 1][y - 1].mined){
                    noMinesSurrounding++;
                }
            }
            //Check NW
            if(y - 1 >= 0 && x - 1 >= 0){
                if(logicBoard[x - 1][y - 1].mined){
                    noMinesSurrounding++;
                }
            }
            //Check SE
            if(y + 1 < boardYCount && x + 1 < boardXCount){
                if(logicBoard[x + 1][y + 1].mined){
                    noMinesSurrounding++;
                }
            }
            //Check NE
            if(y + 1 < boardYCount && x - 1 >= 0){
                if(logicBoard[x - 1][y + 1].mined){
                    noMinesSurrounding++;
                }
            }
            logicBoard[x][y].mineCountAround = noMinesSurrounding;
        }
    }
}

function setTileClickEvent(){
    let tiles = board.querySelectorAll("td");
    for(let i = 0;i < tiles.length; i++){
        let coords = idtoXYCoords(tiles[i].id);
        let logicBoardXCoords = coords.x
        let logicBoardYCoords = coords.y;
        //setTileImage(tiles[i],TILE_IMG.HIDDEN);
        let logicTile = logicBoard[logicBoardXCoords][logicBoardYCoords]
        tiles[i].addEventListener("mousedown", event => {
            if(!logicTile.revealed && minesweeperGame.status === 0){
                if(logicTile.flagged){
                    if (event.button === 2){
                        logicTile.flagged = false;
                        setTileImage(tiles[i],TILE_IMG.HIDDEN);
                    }
                }else{
                    if (event.button === 2){
                        logicTile.flagged = true;
                        setTileImage(tiles[i],TILE_IMG.FLAG);
                    } else if (event.button === 0){  
                        logicTile.revealed = true;
                        if(logicTile.mined){
                            setTileImage(tiles[i],TILE_IMG.MINE_CLICKED);
                        } else{
                            if(logicTile.mineCountAround === 0){
                                setTileImage(tiles[i],TILE_IMG.REVEALED);
                                let tilesToCheck = [];
                                let tilesToUpdate = [];
                                tilesToCheck.push(logicTile);
                                tilesToUpdate.push(logicTile);
                                

                                let counter = 0;

                                while(tilesToCheck.length > 0){
                                    let tile = tilesToCheck[0];
                                    let surroundTiles = addSurroundingTiles(tile);

                                    for (let i = 0; i < surroundTiles.length; i++) {
                                        if(surroundTiles[i].mineCountAround === 0){
                                            if(!tilesToUpdate.includes(surroundTiles[i])){
                                                tilesToCheck.push(surroundTiles[i]);
                                            }
                                        }

                                        if(!tilesToUpdate.includes(surroundTiles[i])){
                                            tilesToUpdate.push(surroundTiles[i]);
                                        
                                        }
                                    }

                                    tilesToCheck.shift();

                                    counter++
                                    if(counter == 80) break;
                                }

                                for (let i = 0; i < tilesToUpdate.length; i++) {
                                    let DOMTile = getTileFromCoords(tilesToUpdate[i].x,tilesToUpdate[i].y);
                                    if(tilesToUpdate[i].mineCountAround === 0){
                                        setTileImage(DOMTile,TILE_IMG.REVEALED);
                                    }else{
                                        setTileImage(DOMTile,tilesToUpdate[i].mineCountAround);
                                    }
                                    tilesToUpdate[i].revealed = true;
                                }

                                /**
                                 * 1. Clicked on 0 mines around tile
                                 * 2. Add surrounding tiles around to array
                                 * 3. Filter for revealed tiles and OOB tiles
                                 * 4. Add tiles to be updated for image(), must filter to check if already in update array
                                 * 5. Check each tile added if qualify for surround checking function (Must be 0 surrounding mines)
                                 * 6. Repeat
                                 */
                            }else{
                                setTileImage(tiles[i],logicTile.mineCountAround);
                            }
                        }
                        checkGameStatus();
                    }
                }
            }
        })
    }
    return;
}

function getTileFromCoords(x,y){
    let tileId = `t${x}_${y}`;
    return document.getElementById(tileId);
}

function resetGame(){
    if(minesweeperGame.status === 1 || minesweeperGame.status === 2 || minesweeperGame.ongoing){
        minesweeperGame.status = 0;
        minesweeperGame.ongoing = false;
        logicBoard = [];
        drawBoard(tileSize,boardXCount,boardYCount);
        initLogicBoard();
    }
}

function addSurroundingTiles(logicTile){
    let tiles = [];
    let x = logicTile.x
    let y = logicTile.y; 

    if(y - 1 >= 0){
        if(!logicBoard[x][y - 1].revealed){
            tiles.push(logicBoard[x][y - 1])
        }
    }
    if(y + 1 < boardYCount){
        if(!logicBoard[x][y + 1].revealed){
            tiles.push(logicBoard[x][y + 1])
        }
    }
    if(x + 1 < boardXCount){
        if(!logicBoard[x + 1][y].revealed){
            tiles.push(logicBoard[x + 1][y])
        }
    }
    if(x - 1 >= 0){
        if(!logicBoard[x - 1][y].revealed){
            tiles.push(logicBoard[x - 1][y])
        }
    }
    if(y - 1 >= 0 && x + 1 < boardXCount){
        if(!logicBoard[x + 1][y - 1].revealed){
            tiles.push(logicBoard[x + 1][y - 1])
        }
    }
    if(y - 1 >= 0 && x - 1 >= 0){
        if(!logicBoard[x - 1][y - 1].revealed){
            tiles.push(logicBoard[x - 1][y - 1])
        }
    }
    if(y + 1 < boardYCount && x + 1 < boardXCount){
        if(!logicBoard[x + 1][y + 1].revealed){
            tiles.push(logicBoard[x + 1][y + 1])
        }
    }
    if(y + 1 < boardYCount && x - 1 >= 0){
        if(!logicBoard[x - 1][y + 1].revealed){
            tiles.push(logicBoard[x - 1][y + 1])
        }
    }
    
    return tiles;
}

function checkGameStatus(){
    let revealedTiles = boardXCount * boardYCount - mineCount;
    let revealedCount = 0;
    for (let i = 0; i < boardXCount; i++) {
        for (let j = 0; j < boardYCount; j++) {
            let logicTile = logicBoard[i][j];
            if(logicTile.mined && logicTile.revealed){
                minesweeperGame.status = 2;
                minesweeperGame.ongoing = false;
                updateSystemMessaage("Game over. You lose.");
                break;
            }else if(!logicTile.mined && logicTile.revealed){
                revealedCount++;
            }
        }
    }
    if(revealedCount === revealedTiles){
        minesweeperGame.status = 1;
        minesweeperGame.ongoing = false;
        updateSystemMessaage("Game end. You won.");
    }
}

function displayLogicBoard(){
    let bigstr = "";
    for (let i = 0; i < logicBoard.length; i++) {
        let row = logicBoard[i];
        for (let j = 0; j < logicBoard[i].length; j++) {
            if(row[j].mined){
                bigstr += "1,";
            }else{
                bigstr += "0,";
            }
        }
        bigstr = bigstr.substring(0,bigstr.length-1);
        bigstr += "\n";
    }
    console.log(bigstr);
}

function updateSystemMessaage(message){
    messageBox.innerHTML = message;
}