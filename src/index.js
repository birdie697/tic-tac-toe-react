import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={props.squareStatus}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}


class Board extends React.Component {

  isWinningSquare(i, squares) {
    const winner = calculateWinner(squares);

    if (winner) {
      const winningSquares = winner.winningSquares;
      if (winningSquares.includes(i)) {
        return true;
      } else {
        return false;
      }
    }
  }

  createGrid = () => {
    let grid = [];

    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(<span>{this.renderSquare(i*3+j)}</span>)
      }
      grid.push(<div className="board-row">{squares}</div>)
    }
    return grid
  }

  renderSquare(i) {
    const squareStatus = this.isWinningSquare(i, this.props.squares) ? "winningSquare" : "square"
    return (
      <Square
        value={this.props.squares[i]}
        squareStatus={squareStatus}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {this.createGrid()}
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
          location: '',
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length -1 ];
      const squares = current.squares.slice();
      const newLocation = columnRow(i);
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          location: newLocation,
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' at ' + step.location:
        'Go to game start';
      return (
        <li key={move}>
          <button
            className="button"
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

//locations map left to right, bottom to top
function columnRow(i) {
  const gridMap = {
    0: "(1,3)",
    1: "(2,3)",
    2: "(3,3)",
    3: "(1,2)",
    4: "(2,2)",
    5: "(3,2)",
    6: "(1,1)",
    7: "(2,1)",
    8: "(3,1)",
  }
  return gridMap[i];
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
      return {
        winner:  squares[a],
        winningSquares: [a, b, c]
      }
    }
  }
  return null;
}
