//event listeners moved to display controller module

//module: game board
const gameBoard = (function() {
    
    let board = [];
    let played= [];
    let movesSoFar = 0;
    let currentPlayer = 0; //initialise first player = 0;
    let tokens = [];
    let firstPlayerSet = false;
    let tokenCount =0;
    let gameOver = false;               

    const init = () => {
        let pos = 0;
        for (pos; pos < 9; pos++) {
            board.push('-');
        }
    };

    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    const changeCurrentPlayer = () => {
        currentPlayer = currentPlayer ? 0 :1;       //alternates play
        console.log(`currentPlayer: player ${currentPlayer} plays ${tokens[currentPlayer]}`);
    }

    const setTokens = (token_0, token_1) => {
        if(tokenCount === 0) {
            tokenCount++;
            tokens.push(token_0);
            tokens.push(token_1);
        }else{
            tokens.splice(0,1,token_0);
            tokens.splice(1,1,token_1);
        }
        console.log(`tokens: ${tokens[0]}, ${tokens[1]}`);
    }

    const getToken = (player) => {
        return tokens[player];
    }

    const setPos = (square, token) => {
        board.splice(square, 1, token);
        console.log(JSON.stringify(board));
    };

    const getPos = (square) => {
        const token = board[square];
        return token;
    };

    const checkWon = () => {
        let gameWon = 'Continue playing';
        let winLine =[];
        console.log(JSON.stringify(board));
        //check rows
        if(!(board[0] === '-')){
            if((board[0] === board [1]) && (board[0] === board[2])) {console.log('win top row'); gameWon = `${board[0]} wins`; winLine.push([0,1,2]);}
        }
        if(!(board[3] === '-')){
            if((board[3] === board [4]) && (board[3] === board[5]) ){console.log('win middle row'); gameWon = `${board[3]} wins`; winLine.push([3,4,5]);}
        }
        if(!(board[6] === '-')){
            if((board[6] === board [7]) && (board[6] === board[8]) ){console.log('win bottom row'); gameWon = `${board[6]} wins`; winLine.push([6,7,8]);}
        }

        //check diagonals
        if(!(board[0] === '-')){
            if((board[0] === board [4])&&( board[0] === board[8])) {console.log('win diagonal TL -> BR'); gameWon = `${board[0]} wins`; winLine.push([0,4,8]);}
        }
        if(!(board[6] === '-')){
            if((board[6] === board [4]) && (board[6] === board[2]) ){console.log('win diagonal BL -> TR'); gameWon = `${board[6]} wins`; winLine.push([6,4,2]);}
        }
    
        //check columns
        if(!(board[0] === '-')){
            if((board[0] === board[3]) && (board[0] === board[6])) {console.log('win left column'); gameWon = `${board[0]} wins`; winLine.push([0,3,6]);}
        }
        if(!(board[1] === '-')){
            if((board[1] === board[4]) && (board[1] === board[7]) ){console.log('win center column'); gameWon = `${board[1]} wins`; winLine.push([1,4,7]);}
        }
        if(!(board[2] === '-')){
            if((board[2] === board[5]) && (board[2] === board[8]) ){console.log('win right column'); gameWon = `${board[2]} wins`; winLine.push([2,5,8]);}
        }
        display.highlightWin(winLine[0]);
        return gameWon;
    }
    
    const checkWinPossible = (moves) => {
        let possible = false;
        if(!(moves === 9)) {console.log(`${moves} less than 9 checking if win possible`)
            //win possible if:
            // one of row == '-' AND the other two equal to 'X' or both equal 'O'
            // OR one of col == '-' AND the other two equal to 'X' or both equal 'O'
            // OR one of diag == '-' AND the other two equal to 'X' or both equal 'O'

            //check rows for sq = 0, 3, 6
            if(!possible){ possible = checkRow(0);}
            if(!possible){ possible = checkRow(3);}
            if(!possible){ possible = checkRow(6);}
            //check cols for sq = 0, 1, 2
            if(!possible){ possible = checkCol(0);}
            if(!possible){ possible = checkCol(1);}
            if(!possible){ possible = checkCol(2);}
            //check diagonals at sq 0 and 2
            if(!possible){ possible = checkDiag(0);}
            if(!possible){ possible = checkDiag(2);}     
        }
        else{
            //must have played all squares so should not arrive here
            console.log("error ? 9 moves played !");
        }
        if(possible) {console.log('A win is still available; continue play');}
        else{
            console.log('A win is not available; tied game - no winner possible')
        }
        return possible;
    }

    function checkRow(row_n) {
        console.log(`checking row ${row_n}`);
        let winPoss = false;
        let xCount = 0;
        let oCount = 0;
        let bCount = 3;
        let n = row_n;  //where row_n = sq 0 ,3 or 6
        for( i = n; i < n+3; i++){
            if(board[i] === 'X') { xCount++ };
            if(board[i] === 'O') { oCount++ };
            if(board[i] === '-') { bCount-- };
        }

        //already checked for win so here win not possible 
        if(bCount === 0) {
            return winPoss; //false
        }

        //if two sq = '-' then possible
        if(bCount > 1) {
            return winPoss= true;
        }

        //check if at least 1 sq = '-'
        if(bCount == 1) {
            if( (xCount > 1) || (oCount > 1) ) { 
            return winPoss = true;
            }
        }
    }

    function checkCol(col_n) {
        let winPoss = false;
        let xCount = 0;
        let oCount = 0;
        let bCount = 3;
        let n = col_n;  //where col_n = sq 0 ,1 or 2
        for( i = n; i < n+6; i+= 3){
            if(board[i] === 'X') { xCount++ };
            if(board[i] === 'O') { oCount++ };
            if(board[i] === '-') { bCount-- };
        }

        //already checked for win so here win not possible 
        if(bCount === 0) {
            return winPoss; //false
        }

        //if two sq = '-' then possible
        if(bCount > 1) {
            return winPoss= true;
        }

        //check if at least 1 sq = '-'
        if(bCount == 1) {
            if( (xCount > 1) || (oCount > 1) ) { 
            return winPoss = true;
            }
        }
    }

    function checkDiag(diag_n) {
        let winPoss = false;
        let xCount = 0;
        let oCount = 0;
        let bCount = 3;
        let n = diag_n;  //where diag_n = sq 0  or 2
        
        if(n=0) {
            for( i = n; i < n+9; i+= 4){
                if(board[i] === 'X') { xCount++ };
                if(board[i] === 'O') { oCount++ };
                if(board[i] === '-') { bCount-- };
            }
        }else{
            //n=2
            for( i = n; i < n+5; i+= 2){
                if(board[i] === 'X') { xCount++ };
                if(board[i] === 'O') { oCount++ };
                if(board[i] === '-') { bCount-- };
            }
        }

        //already checked for win so here win not possible 
        if(bCount === 0) {
            return winPoss; //false
        }

        //if two sq = '-' then possible
        if(bCount > 1) {
            return winPoss= true;
        }

        //check if at least 1 sq = '-'
        if(bCount == 1) {
            if( (xCount > 1) || (oCount > 1) ) { 
            return winPoss = true;
            }
        }
    }

    const checkState = () => {
        console.log("checking game state");
         //win?
        const won = gameBoard.checkWon();
        console.log(won);
        console.log(won[0]);
        if((won[0] === 'O') || (won[0] === 'X') ) {
            display.logWin(`'${won[0]}' WINS!`);
            switch(currentPlayer) {
                case 0: { display.logWinner('1st player wins!'); break;}
                case 1: { display.logWinner('2nd player wins!'); break;}
            }
            gameBoard.setGameOver();
        }else{
            if(won[0] === 'C'){
                const winable = checkWinPossible(gameBoard.movesSoFar);
                if(!winable){
                    display.logTied('TIED GAME !')
                    gameBoard.setGameOver();
                }
            }
        }
    }

    const setPlayed = (square) => {
        played.push(square);
    };

    const getPlayed = () => {
        return played;
    };

    const setGameOver = () => {
        gameBoard.gameOver = true;
        display.logError('GAME OVER !');
        //reSet
        document.querySelector(".reset").style.display='grid';
    };

    const getGameOver = () => {
        return gameBoard.gameOver;
    };

    const reset = () => {
        board = [];
        played= [];
        movesSoFar = 0;
        currentPlayer = 0; //initialise first player = 0;
        tokens = [];
        firstPlayerSet = false;
        tokenCount =0;
        gameOver = false;
        gameBoard.init();
    }

    return {init, firstPlayerSet, setPos, getPos, checkWon, checkWinPossible, movesSoFar, setTokens, getToken, changeCurrentPlayer, checkState, getCurrentPlayer , setPlayed , getPlayed, setGameOver, getGameOver, reset};
})();

//module: display controller
const display = (function() {
    
    //play
    const init = gameBoard.init();

    const displayBoard = () => {
        let token;
        let row1 = [];
        let row2 = [];
        let row3 = [];
        for (let i=0; i<9; i++){
            token = gameBoard.board[i];
            if (i<3){row1.push(token);
             }
            else{
                if (i<6){row2.push(token);
                }
                else{
                    if (i>5){row3.push(token);
                    }
                }
            }
        }
        console.log(row1);
        console.log(row2);
        console.log(row3);
    };

    //event listener allocate symbols to first & second players
    document.querySelector(".plays").addEventListener("click", function(event){
        console.log(`moves:  ${gameBoard.movesSoFar}`);
        if(gameBoard.movesSoFar < 1) {  
            let e = event.target;
            console.log('square: '+e.id);
            
            switch (e.id) {
                case 'playsX-1': {
                    console.log('player 0 plays X and goes first');
                    //X1.checked = true;
                    console.log('player 1 plays O and goes second');
                    //O1.checked = false;
                    gameBoard.setTokens('X','O');
                    gameBoard.firstPlayerSet = true;
                    break;
                }

                case 'playsO-1': {
                    console.log('player 0 plays O and goes first');
                    // O1.checked = true;
                    console.log('player 1 plays X and goes second');
                    // X1.checked = false;
                    gameBoard.setTokens('O','X');
                    gameBoard.firstPlayerSet = true;
                    break;
                }
            }
        }else{
            let message = "Cannot change player state once moved";
            display.logError(message);
        } 
        
    });

    //event listern for and action board moves
    document.querySelector(".board").addEventListener("click", function(event){
        if(gameBoard.firstPlayerSet) {
            let e = event.target.closest('input');
            if (!e) return;
            console.log('square '+e.id);
            console.log("player is  " + gameBoard.getCurrentPlayer());
            console.log("token is  " + gameBoard.getToken(gameBoard.getCurrentPlayer()));
            e.value = gameBoard.getToken(gameBoard.getCurrentPlayer());
            //already played this square?
            if(!(gameBoard.getPlayed().includes(e.id))) {
            // gameBoard.updateMoves(e);
                display.updateMoves(e);
                console.log(`moves:  ${gameBoard.movesSoFar}`);
                if(gameBoard.movesSoFar > 4) {
                        gameBoard.checkState();
                }
                if(!gameBoard.getGameOver() ){
                    gameBoard.changeCurrentPlayer();
                }
            }
            else{
                let message = "invalid move";
                display.logError(message);
            }
        }else{
            let message = "Must select player to play first!";
            display.logError(message);
        }
    });

    const updateMoves = (e) => {
        gameBoard.movesSoFar++;
        const element = document.querySelector(".rightPanel>h2");
        element.textContent = `Moves so far: ${gameBoard.movesSoFar}`;
        gameBoard.setPos(e.id, e.value);
        gameBoard.setPlayed(e.id);
    }

    const logError = (message) => {
        const element = document.querySelector(".footDiv");
        console.log('element = ' + element);
        element.style.backgroundColor = 'aqua';
        element.style.justifyContent= 'center';
        element.style.alignItems= 'center';
        element.style.fontWeight= '700';
        element.style.color='red';
        element.textContent = message;
        console.log(message);
        //after delay
        setTimeout(function() {
           element.style = 'none';
           element.textContent= "";
        }, 3000);
    }

    const logWin = (message) => {
        const element = document.querySelector(".win");
        console.log('element = ' + element);
        element.style.backgroundColor = 'yellow';
        element.style.color='blue';
        element.textContent = message;
        console.log(message);
    }

    const logWinner = (message) => {
        const element = document.querySelector(".winner");
        console.log('element = ' + element);
        element.style.backgroundColor = 'yellow';
        element.style.color='blue';
        element.textContent = message;
        console.log(message);
    }

    const logTied = (message) => {
        const element = document.querySelector(".winner");
        console.log('element = ' + element);
        element.style.backgroundColor = 'brown';
        element.style.color='yellow';
        element.textContent = message;
        console.log(message);
    }

    const highlightWin = ([sq1, sq2, sq3]) => {
        const square_1 = "[id='" + sq1 + "']";
        const square_2 = "[id='" + sq2 + "']";
        const square_3 = "[id='" + sq3 + "']";
        const e1 = document.querySelector(square_1);
        const e2 = document.querySelector(square_2);
        const e3 = document.querySelector(square_3);
        e1.style.backgroundColor='lightgreen';
        e2.style.backgroundColor='lightgreen';
        e3.style.backgroundColor='lightgreen';
    }
    
    //event listener for and action game reset
    document.querySelector(".reset").addEventListener("click", function(event){
        let e = event.target;
        gameBoard.reset();
        console.log("resetting game");
        e.style.display='none';
        window.location.reload();
    });

    return {init,displayBoard, updateMoves, logError, logWin, logWinner, logTied, highlightWin}; 
})();

//instigate play
display.init;
