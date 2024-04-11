import React , {useContext, useState} from 'react';

function Square({value, onSquareClick}){
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function BoardRow({squares, cells, onSquareClick}){
    // const clickContext = SquareClickContext;
    
    return (
        <div className='board-row'>
            {/* <Square value={squares[cells[0]]} onSquareClick={() => onSquareClick(cells[0])} />
            <Square value={squares[cells[1]]} onSquareClick={() => onSquareClick(cells[1])} />
            <Square value={squares[cells[2]]} onSquareClick={() => onSquareClick(cells[2])} />
            <Square value={squares[cells[3]]} onSquareClick={() => onSquareClick(cells[3])} />
            <Square value={squares[cells[4]]} onSquareClick={() => onSquareClick(cells[4])} />
            <Square value={squares[cells[5]]} onSquareClick={() => onSquareClick(cells[5])} />
            <Square value={squares[cells[6]]} onSquareClick={() => onSquareClick(cells[6])} /> */}
            <Square value={cells[0]} onSquareClick={() => onSquareClick(cells[0])} />
            <Square value={cells[1]} onSquareClick={() => onSquareClick(cells[1])} />
            <Square value={cells[2]} onSquareClick={() => onSquareClick(cells[2])} />
            <Square value={cells[3]} onSquareClick={() => onSquareClick(cells[3])} />
            <Square value={cells[4]} onSquareClick={() => onSquareClick(cells[4])} />
            <Square value={cells[5]} onSquareClick={() => onSquareClick(cells[5])} />
            <Square value={cells[6]} onSquareClick={() => onSquareClick(cells[6])} />
        </div>
    );
}

function Board(){
    const [currentMove, setCurrentMove] = useState(0);
    // const [squares, setSquares] = useState([Array(42).fill(null)])
    const [squares, setSquares] = useState(Array(42).fill(null))
    const isRNext = currentMove % 2 === 0; 
    

    function handleClick(i){
        console.log(`Board: ${i} clicked`);
        let columnNum = i % 7;

        if (squares[columnNum]) return;

        let nextOpenSquare = getNextSquareInColumn(columnNum);

        const nextSquares = squares.slice();
        nextSquares[nextOpenSquare] = isRNext? "R" : "B"; 
        setSquares(nextSquares) ;
        setCurrentMove(currentMove + 1);

        calculateWinner(columnNum, nextOpenSquare, squares);
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

    return(
        <div className='game'>
            <div className='board'>
                <Board />
            </div>
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
    let r = (linearIndex - c) % 6;
    console.log("calculateWinner:")
    console.log(`   Square ${linearIndex} is at ${[c,r]}. Square contains ${board2D[r][c]}`)
    
    const lines = [
        // Vertial Win States
        [[0, 0], [0, 1], [0, 2], [0, 3]],
        [[0,-1], [0, 0], [0, 1], [0, 2]],
        [[0, 2], [0,-1], [0, 0], [0, 1]],
        [[0,-3], [0,-2], [0,-1], [0, 0]],
        // Horizontal Win States
        [[0, 0], [ 1,0], [ 2,0], [ 3,0]],
        [[-1,0], [ 0,0], [ 1,0], [ 2,0]],
        [[ 2,0], [-1,0], [ 0,0], [ 1,0]],
        [[-3,0], [-2,0], [-1,0], [ 0,0]],
        // Diagonal Decreasing Win States
        // [[0,1], [0,2], [0,2]],
        // [[0,1], [0,2], [0,2]],
        // [[0,1], [0,2], [0,2]],
        // [[0,1], [0,2], [0,2]],
        // // Diagonal Increasing Win States
        // [[0,1], [0,2], [0,2]],
        // [[0,1], [0,2], [0,2]],
        // [[0,1], [0,2], [0,2]],
        // [[0,1], [0,2], [0,2]],
        
    ];
    
    // Loop through each possible win 
    // condition including the most recently placed token
    for (var i=0; i < lines.length; i++){
        if (validateCoordniates(i, c, r, lines[i])){
            var [t0, t1, t2, t3]= lines[i];
            var p1, p2, p3, p4;
            // p1 = squares[board2D[c+t0[0],r+t0[1]]];
            p1 = board2D[r+t0[1]][c+t0[0]];
            p2 = board2D[r+t1[1]][c+t1[0]];
            p3 = board2D[r+t2[1]][c+t2[0]];
            p4 = board2D[r+t3[1]][c+t3[0]];
             // Transform Coordinates

            console.log(`               calculateWinner:\n     Checking... \n      ${[c+t0[0],r+t0[1]]}, ${[c+t1[0],r+t1[1]]}, ${[c+t2[0],r+t2[1]]}, ${[c+t3[0],r+t3[1]]}`)
            console.log(`calculateWinner: ${t0}`)
            console.log(`calculateWinner: ${[p1,p2,p3,p4]}`)




        };
    }
    
    
    
    return;
}
const [bWidthd, bHieght] = [7,6]; 

function validateCoordniates(i,c,r, transforms){
    const comments = true;
    if (comments) {console.log(`       coordinateValidator: Checking line ${i} ${transforms} ...`)};
    for (var i = 0, l = transforms.length; i < l; i++){
        var cT = transforms[i][0] + c; // c transformed
        var rT = transforms[i][1] + r; // r transformed


        // Check Veritical bounds
        // if (cT < 0 || cT >= bHieght) return false;
        if (cT < 0 || cT >= bWidthd) {
            if (comments) {console.log(`           coordinateValidator: ${[cT, rT]} fails: column out of bounds`)};
            return false;
        }
        
        // Check horizontal bounds
        // if (rT < 0 || rT >= bWidthd) return false;
        if (rT < 0 || rT >= bHieght){
            if (comments) {console.log(`           coordinateValidator: ${[cT, rT]} fails: row out of bounds`)};
            return false;
        } 


        if (comments) {console.log(`           coordinateValidator: ${[cT, rT]} is pass`)};
    }
    if (comments) {console.log(`         coordinateValidator: ${transforms} is totally valid`)};
    return true;
}