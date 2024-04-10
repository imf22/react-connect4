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

export default function Board(){
    const [currentMove, setCurrentMove] = useState(0);
    // const [squares, setSquares] = useState([Array(42).fill(null)])
    const [squares, setSquares] = useState(Array(42).fill(null))
    

    function handleClick(i){
        console.log(`Board: ${i} clicked`);
        
        const nextSquares = squares.slice();
        console.log(squares); 
        console.log(nextSquares); 
        nextSquares[i] = "R"; 
        setSquares(nextSquares) ;
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