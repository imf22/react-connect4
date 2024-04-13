import React , {useState} from 'react';

const [bWidthd, bHieght] = [7,6];       // Board Dimensions
const board2D = [                       // 2D Array: Maps linear Board array indecies to a 2D array
    [ 0, 1, 2, 3, 4, 5, 6],
    [ 7, 8, 9,10,11,12,13],
    [14,15,16,17,18,19,20],
    [21,22,23,24,25,26,27],
    [28,29,30,31,32,33,34],
    [35,36,37,38,39,40,41]
];

const replayUpdateInterval = 500;       // Time in between each move replay. In ms 1000ms = 1


function RedToken(){
    return (
        <div className='token-p1'>●</div>
    )
}

function BlackToken(){
    return (
        <div className='token-p2'>●</div>
    )
}

function Square({value, onSquareClick}){
    let token;
    if (value){
        token = value === "R"? <RedToken/> : <BlackToken/>
    }

    return (
        <button className="square" onClick={onSquareClick}>
            {token}
        </button>
    );
}

function BoardRow({squares, cells, onSquareClick}){
    
    return (
        <div className='board-row'>
            <Square value={squares[cells[0]]} onSquareClick={() => onSquareClick(cells[0])} />
            <Square value={squares[cells[1]]} onSquareClick={() => onSquareClick(cells[1])} />
            <Square value={squares[cells[2]]} onSquareClick={() => onSquareClick(cells[2])} />
            <Square value={squares[cells[3]]} onSquareClick={() => onSquareClick(cells[3])} />
            <Square value={squares[cells[4]]} onSquareClick={() => onSquareClick(cells[4])} />
            <Square value={squares[cells[5]]} onSquareClick={() => onSquareClick(cells[5])} />
            <Square value={squares[cells[6]]} onSquareClick={() => onSquareClick(cells[6])} />
        </div>
    );
}

function Board({winner, isRNext, squares, onPlay}){
    
    // Triggers game to place a new token at next available square in column if it exist
    function handleClick(i){
        // console.log(`Board: ${i} clicked`);
        let columnIndex = i % 7;

        if (winner || squares[columnIndex]) return;                 // Short-circuit if there is a winner or top sqaure in column is filled

        let nextOpenSquare = getNextSquareInColumn(columnIndex);
        const nextSquares = squares.slice();
        nextSquares[nextOpenSquare] = isRNext? "R" : "B";           // Add new token to next board data

        onPlay(nextSquares, [columnIndex, nextOpenSquare]);         // Tell Game to add board to history, check for winner and update all data
    }

    // 
    function getNextSquareInColumn(c){
        for (let i=c ; i<35; i){
            if (squares[i+7]){
                return i;  
            }
            i += 7;
        }
        return c + 35
    }

    return (
        <>
            <BoardRow squares={squares} cells={[ 0, 1, 2, 3, 4, 5, 6]} onSquareClick={handleClick}/>
            <BoardRow squares={squares} cells={[ 7, 8, 9,10,11,12,13]} onSquareClick={handleClick}/>
            <BoardRow squares={squares} cells={[14,15,16,17,18,19,20]} onSquareClick={handleClick}/>
            <BoardRow squares={squares} cells={[21,22,23,24,25,26,27]} onSquareClick={handleClick}/>
            <BoardRow squares={squares} cells={[28,29,30,31,32,33,34]} onSquareClick={handleClick}/>
            <BoardRow squares={squares} cells={[35,36,37,38,39,40,41]} onSquareClick={handleClick}/>
        </>
    );
}

export default function Game(){
    const [winner, setWinner] = useState(null);
    const [history, setHistory] = useState([Array(42).fill(null)]);      // Contains the list of every board state 
    const [currentMove, setCurrentMove] = useState(0);
    const isRNext = currentMove % 2 === 0; 
    const currentSquares = history[currentMove];

    const [replaying,setReplaying] = useState(false);

    // Update game status msg
    let statusMsg;
    if (winner){
        statusMsg = `${winner} wins!`;
    } else if (calculateIfFull(currentSquares)){
        statusMsg = 'Draw!'
    } else {
        statusMsg = isRNext ? "P1 Turn" : "P2 Turn";
    }

    // Display Replay button
    let replayButton;
    if (winner) {replayButton = <button className='controls-button' id='replay-button' onClick={replayGame}>WATCH GAME REPLAY </button>}

    // Display Undo button
    let undoButton = <button className='hidden-button'>UNDO</button>;
    if (!winner && currentMove > 0) {undoButton = <button className='controls-button' onClick={undoLastTurn}>UNDO</button>}
    

    // Display Redo button
    let redoButton = <button className='hidden-button'>REDO</button>;
    if (!winner && currentMove < history.length - 1) {redoButton = <button className='controls-button' onClick={redoLastTurn}>REDO</button>}
    


    return(
        <div className='game'>
            <div className='player-tags-bar'>
                <p id='tag-p1'>P1</p>
                <p id='tag-p2'>P2</p>
            </div>
            <div className='board'>
                <Board winner={winner} isRNext={isRNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <p className='status'>{statusMsg}</p>
            
            <div className='controls-bar'>
                <div className='single-move-controls'>
                    <div>{undoButton}</div>
                    <div>{redoButton}</div>
                </div>
                <button id='restart-button' className='controls-button' onClick={restartGame}>RESTART GAME</button>
            </div>
                <>{replayButton}</>

        </div>
    );

    // Handles updating the game on a square being clicked
    function handlePlay(nextSquares, squarePos){
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setWinner(calculateWinner(squarePos[0], squarePos[1], nextSquares));
        console.log(`Current Move: ${currentMove}`);
    }

    function undoLastTurn(){
        if (winner) return;

        const nextMove = currentMove - 1;
        console.log(`Current Move: ${currentMove}\nNext Move: ${nextMove}`)
        if (nextMove > -1) setCurrentMove(nextMove);
    }

    function redoLastTurn(){
        if (winner) return;

        const nextMove = currentMove + 1;
        console.log(`Current Move: ${currentMove}\nNext Move: ${nextMove}`)
        if (nextMove < history.length) setCurrentMove(nextMove);
    }

    // Triggers a replay of each move in the game
    function replayGame(){
        if (replaying) return;
        
        // Lock board into replay state to prevent multiple replays from occuring
        setReplaying(true); 

        let delay = 250

        // Delay update of each board state. EXAMPLE 
        for (let i = 0; i < currentMove+1; i++) {
            setTimeout(() => {
                // console.log(`Loop: ${i}`);
                setCurrentMove(i);
            }, delay);

            delay += 500;   // Increase timeout for each state update
        }

        // Reset replaying state variable
        setTimeout(() => {
            setReplaying(false);
        }, delay + 1);
        
    }

    // Resets all Game state variables
    function restartGame(){
        setWinner(null);
        setHistory([Array(42).fill(null)]);      // Contains the list of every board state 
        setCurrentMove(0);
        setReplaying(false);
    }
}


function calculateWinner(c, linearIndex, squares){
    //           c  : column 
    //           r  : row
    // linearIndex  : used to calculate which row cell is in from 1D board array;
    //  useComments : enables comments for function
    const r = (linearIndex - c) % 6;
    const useComments = false;
    
    // Debug Comments Displays linear board array index of square and coords of last changed square 
    if (useComments){console.log("calculateWinner:")};
    if (useComments){console.log(`   Square ${linearIndex} is at ${[c,r]}.`)};
    
    const lines = [
        // // Vertial Win States
        [[0, 0], [0, 1], [0, 2], [ 0,3]],
        [[0,-1], [0, 0], [0, 1], [ 0,2]],
        [[0,-2], [0,-1], [0, 0], [ 0,1]],
        [[0,-3], [0,-2], [0,-1], [ 0,0]],
        // // Horizontal Win States
        [[0, 0], [ 1,0], [ 2,0], [ 3,0]],
        [[-1,0], [ 0,0], [ 1,0], [ 2,0]],
        [[-2,0], [-1,0], [ 0,0], [ 1,0]],
        [[-3,0], [-2,0], [-1,0], [ 0,0]],
        // Diagonal Decreasing Win States   
        [[ 0, 0], [ 1, 1], [ 2, 2], [ 3, 3]],
        [[-1,-1], [ 0, 0], [ 1, 1], [ 2, 2]],
        [[-2,-2], [-1,-1], [ 0, 0], [ 1, 1]],
        [[-3,-3], [-2,-2], [-1,-1], [ 0, 0]],
        // // Diagonal Increasing Win States
        [[ 0, 0], [-1, 1], [-2, 2], [-3, 3]],
        [[ 1,-1], [ 0, 0], [-1, 1], [-2, 2]],
        [[ 2,-2], [ 1,-1], [ 0, 0], [-1, 1]],
        [[ 3,-3], [ 2,-2], [ 1,-1], [ 0, 0]]
    ];
    
    // Loop through each possible win 
    // condition including the most recently placed token
    for (var i=0; i < lines.length; i++){
        if (validateCoordniates(i, c, r, lines[i])){
            var [t0, t1, t2, t3]= lines[i];     // Transform Coordinates
            var p1, p2, p3, p4;                 // Value at square
            
            // Get contents of each square in the line from board
            p1 = squares[board2D[r+t0[1]][c+t0[0]]];
            p2 = squares[board2D[r+t1[1]][c+t1[0]]];
            p3 = squares[board2D[r+t2[1]][c+t2[0]]];
            p4 = squares[board2D[r+t3[1]][c+t3[0]]];
            
            // Debug Comments Displays coords of each square in current line and contents of squares in that line
            if (useComments){console.log(`           calculateWinner:   Checking ${[c+t0[0],r+t0[1]]}, ${[c+t1[0],r+t1[1]]}, ${[c+t2[0],r+t2[1]]}, ${[c+t3[0],r+t3[1]]}`)};
            if (useComments){console.log(`               calculateWinner: ${[p1,p2,p3,p4]}`)};

            // Check if first square contains a token then if rest of tokens match
            if (p1 && p1 === p2 && p1 === p3 && p1 === p4) {
                return p1 === 'R'? 'P1' : 'P2';    // There is a winner
            }
        };
    }
    return null; // No winner
}

function validateCoordniates(i,c,r, transforms){
    const comments = false;
    if (comments) {console.log(`       coordinateValidator: Checking line ${i}: ${transforms} ...`)};
    for (var j = 0, l = transforms.length; j < l; j++){
        var cT = transforms[j][0] + c; // c transformed
        var rT = transforms[j][1] + r; // r transformed

        // Check Veritical bounds
        if (cT < 0 || cT >= bWidthd) {
            if (comments) {console.log(`           coordinateValidator: ${[cT, rT]} fails: column out of bounds`)};
            return false;
        }
        
        // Check horizontal bounds
        if (rT < 0 || rT >= bHieght){
            if (comments) {console.log(`           coordinateValidator: ${[cT, rT]} fails: row out of bounds`)};
            return false;
        } 

        if (comments) {console.log(`           coordinateValidator: ${[cT, rT]} is pass`)};
    }
    if (comments) {console.log(`         coordinateValidator: ${transforms} is totally valid`)};
    return true;
}

function calculateIfFull(squares){
    for ( var i = 0, l = squares.length; i < l; i++ )    {
        if ( 'undefined' == typeof squares[i] || null === squares[i] ){
            return false
        }
    }
    return true;
}