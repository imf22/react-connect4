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

function Board(){
    const [currentMove, setCurrentMove] = useState(0);
    // const [squares, setSquares] = useState([Array(42).fill(null)])
    const [squares, setSquares] = useState(Array(42).fill(null))
    const isRNext = currentMove % 2 === 0; 
    

    function handleClick(i){
        console.log(`Board: ${i} clicked`);
        let columnNum = i % 7;

        if (squares[columnNum]) return;

        const nextSquares = squares.slice();
        nextSquares[getNextSquareInColumn(columnNum)] = isRNext? "R" : "B"; 
        setSquares(nextSquares) ;
        setCurrentMove(currentMove + 1);
    }



    function getNextSquareInColumn(c)
    {
        for (let i=c ; i<35; i){
            console.log(`On ${i} checking if ${i+7} is empty`);
            if (squares[i+7]){
                console.log(`   ${i+7} exist!`);
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