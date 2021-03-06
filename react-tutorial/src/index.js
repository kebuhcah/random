import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return ( 
    <button className="square" onClick={props.onClick}>
      {props.winning ? <b>{props.value}</b> : props.value}
    </button>
  );
}
class Board extends React.Component {
  renderSquare(i) {
    return (<Square 
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
      winning={this.props.winningLine && this.props.winningLine.includes(i)}
    />);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      ascending: false,
    };
  }
    
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).symbol || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveSquare: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleSort() {
    this.setState({
      ascending: !this.state.ascending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const descText = move ?
        'Go to move #' + move + ' (row ' + (1 + Math.floor(step.moveSquare / 3)) + ', col ' + (1 + step.moveSquare % 3)+ ')':
        'Go to game start';
      const desc = move === this.state.stepNumber ? <b>{descText}</b> : descText; 
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    const displayedMoves = this.state.ascending ? moves : moves.reverse();


    let status;
    if (winner.symbol) {
      status = 'Winner: ' + winner.symbol;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningLine={winner.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleSort()}>Toggle</button>
          <ul>{displayedMoves}</ul>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {symbol: squares[a], line: lines[i]};
    }
  }
  return {};
}

/* 
  TODO:
  1. Display the move locations in the format “(1, 3)” in the move list. DONE
  2. Bold the currently selected item in the move list. DONE
  3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
  4. Add a toggle button that lets you sort the moves in either ascending or descending order. DONE
  5. When someone wins, highlight the three squares that caused the win. DONE
*/

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
