import React , {useState} from 'react';

function RedToken(){
    return (
        <div className='token-red'>●</div>
    )
}

function BlackToken(){
    return (
        <div className='token-black'>●</div>
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

function Board({isRNext, squares, onPlay}){
    
    function handleClick(i){
        // console.log(`Board: ${i} clicked`);
        // console.log(squares);
        let columnNum = i % 7;

        if (squares[columnNum]) return;

        let nextOpenSquare = getNextSquareInColumn(columnNum);

        const nextSquares = squares.slice();
        nextSquares[nextOpenSquare] = isRNext? "R" : "B"; 

        onPlay(nextSquares, [columnNum, nextOpenSquare]);

        // calculateWinner(columnNum, nextOpenSquare, squares);
    }



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


    function handlePlay(nextSquares, squarePos){
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        calculateWinner(squarePos[0], squarePos[1], nextSquares);
    }

    // Update game status msg
    let statusMsg;
    if (winner){
        statusMsg = `${winner} wins!`;
    } else if (calculateIfFull(currentSquares)){
        statusMsg = 'Draw!'
    } else {
        statusMsg = isRNext ? "Red's Turn" : "Blue's Turn";
    }

    return(
        <div className='game'>
            <div className='board'>
                <Board isRNext={isRNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <p className='status'>{statusMsg}</p>

        </div>
    );
}

const board2D = [
    [ 0, 1, 2, 3, 4, 5, 6],
    [ 7, 8, 9,10,11,12,13],
    [14,15,16,17,18,19,20],
    [21,22,23,24,25,26,27],
    [28,29,30,31,32,33,34],
    [35,36,37,38,39,40,41]
];


function calculateWinner(c, linearIndex, squares){
    //           c  : column 
    //           r  : row
    // linearIndex  : used to calculate which row cell is in from 1D board array;
    //  useComments : enables comments for function
    const r = (linearIndex - c) % 6;
    const useComments = true;
    
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
        [[-1,-1], [ 0, 0], [ 2, 2], [ 3, 3]],
        [[-1,-1], [-2,-2], [ 0, 0], [ 3, 3]],
        [[-1,-1], [-2,-2], [-3,-3], [ 0, 0]],
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
            
            // p1 = board2D[r+t0[1]][c+t0[0]];
            // p2 = board2D[r+t1[1]][c+t1[0]];
            // p3 = board2D[r+t2[1]][c+t2[0]];
            // p4 = board2D[r+t3[1]][c+t3[0]];
            p1 = squares[board2D[r+t0[1]][c+t0[0]]];
            p2 = squares[board2D[r+t1[1]][c+t1[0]]];
            p3 = squares[board2D[r+t2[1]][c+t2[0]]];
            p4 = squares[board2D[r+t3[1]][c+t3[0]]];
            
            // Debug Comments Displays coords of each square in current line and contents of squares in that line
            if (useComments){console.log(`           calculateWinner:   Checking ${[c+t0[0],r+t0[1]]}, ${[c+t1[0],r+t1[1]]}, ${[c+t2[0],r+t2[1]]}, ${[c+t3[0],r+t3[1]]}`)};
            if (useComments){console.log(`               calculateWinner: ${[p1,p2,p3,p4]}`)};




        };
    }
    
    
    
    return;
}
const [bWidthd, bHieght] = [7,6]; 

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