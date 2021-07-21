let mineCount = document.getElementById("mineInput").value;
let board = document.querySelector("#board");

let minesweeperGame = {
    "isOngoing" : false,
    "status": 0, // 0 = none, 1 = win, 2 = lose
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


startButton.addEventListener("click",initLogicBoard);

function initLogicBoard(){

    updateSystemMessaage("");

    for(let i = 0; i < boardXCount; i++){
        let row = [];
        for(let j = 0; j < boardYCount; j++){
            row.push(0);
        }
        logicBoard.push(row);
    }
    placeMines();
    setTileClickEvent();
    gameStart();
}

function placeMines(){
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


function setTileClickEvent(){
     
    let tiles = board.querySelectorAll("td");
    for(let i = 0;i < tiles.length; i++){
        let logicBoardXCoords = tiles[i].id.split("_")[0].substring(1);
        let logicBoardYCoords = tiles[i].id.split("_")[1];
        //if(tiles[i].id){};
        if(logicBoard[logicBoardXCoords][logicBoardYCoords] === 1){
            tiles[i].addEventListener("mousedown", event => {
                

                //If tile revealed
                if(logicBoard[logicBoardXCoords][logicBoardYCoords] !== 4) {
                    //If tile flagged
                    if(logicBoard[logicBoardXCoords][logicBoardYCoords] === 9) {
                        if (event.button == 2){
                            logicBoard[logicBoardXCoords][logicBoardYCoords] = 1;
                            tiles[i].innerHTML = hiddenTile;
                        }
                        return;

                    }

                    //Reveal tile
                    if(event.button == 0){
                        logicBoard[logicBoardXCoords][logicBoardYCoords] = 4;
                        checkTiles();
                        tiles[i].innerHTML = mineTileClicked;
                    }
                    else if (event.button == 2){ //Flag tile
                        logicBoard[logicBoardXCoords][logicBoardYCoords] = 9;
                        tiles[i].innerHTML = flaggedTile;
                    }
                }

                
            })
        } else if (logicBoard[logicBoardXCoords][logicBoardYCoords] === 0) {
            tiles[i].addEventListener("mousedown", event => {
                
                //If tile revealed
                if(logicBoard[logicBoardXCoords][logicBoardYCoords] !== 3) {
                    //If tile flagged
                    if(logicBoard[logicBoardXCoords][logicBoardYCoords] === 8) {
                        if (event.button == 2){
                            logicBoard[logicBoardXCoords][logicBoardYCoords] = 0;
                            tiles[i].innerHTML = hiddenTile;
                        }
                        return;
                    }

                    //Reveal tile
                    if(event.button == 0){
                        logicBoard[logicBoardXCoords][logicBoardYCoords] = 3;
                        checkTiles();
                        tiles[i].innerHTML = revealedTile;
                    }
                    else if (event.button == 2){
                        logicBoard[logicBoardXCoords][logicBoardYCoords] = 8;
                        tiles[i].innerHTML = flaggedTile;
                    }
                }

            })
        }
        
    }

}

function updateSystemMessaage(message){
    messageBox.innerHTML = message;
}

function gameStart(){
    minesweeperGame.isOngoing = true;
    
    while(minesweeperGame.isOngoing){
        if(logicBoard.includes(4)){
            minesweeperGame.isOngoing = false;
            minesweeperGame.status = 2;
        }

        if(!logicBoard.includes(0)){
            minesweeperGame.isOngoing = false;
            minesweeperGame.status = 1;
        }
    }

    switch(minesweeperGame.status){
        case 1: updateSystemMessaage("Game end. You won.");
                break;
        case 2: updateSystemMessaage("Game end. You lose.");
                break;
    }

    minesweeperGame.status = 0;
    
}

function checkTiles(){
    
}

