/*
 *
 * Board highlighting adapted from Chessboard.js Example #5003
 * Modernized to use chessboard2 (no jQuery dependency)
 *
 */
import Chess from '../lib/chess.js';
import {alphaBetaSearch as alphaBetaIDS} from './alphabeta-ids.js';
import {alphaBetaSearch as alphaBetaOrdering} from './alphabeta-ordering.js';
import {alphaBetaSearch} from './alphabeta-direct.js';
import {minimaxSearch} from './minimax.js';

const $ = (id) => document.getElementById(id);

const initBoard = (boardID = 'board') => {
  let board;
  let game;
  let totalWhitePositions;
  let totalWhiteDuration;
  let totalBlackPositions;
  let totalBlackDuration;
  let highlightedSquares = [];

  const blackIsComp = () => {
    return $('black-player').value !== '0';
  }

  const blackSearch = (game, depth) => {
    const aiValue = parseInt($('black-player').value);
    if(aiValue === 1) {
      return minimaxSearch(game, depth);
    }
    if(aiValue === 2) {
      return alphaBetaSearch(game, depth);
    }
    if(aiValue === 3) {
      return alphaBetaOrdering(game, depth);
    }
    return alphaBetaIDS(game, depth);
  }

  const whiteIsComp = () => {
    return $('white-player').value !== '0';
  }

  const whiteSearch = (game, depth) => {
    const aiValue = parseInt($('white-player').value);
    if(aiValue === 1) {
      return minimaxSearch(game, depth);
    }
    if(aiValue === 2) {
      return alphaBetaSearch(game, depth);
    }
    if(aiValue === 3) {
      return alphaBetaOrdering(game, depth);
    }
    return alphaBetaIDS(game, depth);
  }

  const moveSearch = (game, depth) => {
    if(game.turn() === 'w') return whiteSearch(game, depth);
    return blackSearch(game, depth);
  }

  const getBestMove = () => {
    checkGameOver();

    const depth = game.turn() === 'w' ? parseInt($('white-search-depth').value, 10) : parseInt($('black-search-depth').value, 10);
    const startTime = new Date().getTime();
    const {move: bestMove, positionsGenerated} = moveSearch(game, depth);
    const endTime = new Date().getTime();
    const duration = endTime - startTime;
    const whiteMoves = Math.ceil((game.history().length+1)/2);
    const blackMoves = Math.floor((game.history().length+1)/2);

    updateStats(game.turn(), positionsGenerated, duration, whiteMoves, blackMoves);

    if ((game.turn() === 'b' && whiteIsComp()) || (game.turn() === 'w' && blackIsComp())) {
      window.setTimeout(() => makeMove(getBestMove()), 250);
    }

    return bestMove;
  }

  const setText = (id, value) => {
    $(id).textContent = value;
  };

  const updateStats = (turn, positions, duration, whiteTurns, blackTurns) => {
    if(turn === 'w'){
      totalWhiteDuration += duration;
      totalWhitePositions += positions;
      setText('white-num-positions', positions);
      setText('white-move-time', duration/1000);
      setText('white-position-rate', Math.floor(positions * 1000 / duration));
      setText('white-total-positions', totalWhitePositions);
      setText('white-total-duration', totalWhiteDuration/1000);
      setText('white-avg-positions', Math.round(totalWhitePositions/whiteTurns));
      setText('white-avg-duration', (totalWhiteDuration / (1000 * whiteTurns)).toFixed(3));
    }
    else {
      totalBlackDuration += duration;
      totalBlackPositions += positions;
      setText('black-num-positions', positions);
      setText('black-move-time', duration/1000);
      setText('black-position-rate', Math.floor(positions * 1000 / duration));
      setText('black-total-positions', totalBlackPositions);
      setText('black-total-duration', totalBlackDuration/1000);
      setText('black-avg-positions', Math.round(totalBlackPositions/blackTurns));
      setText('black-avg-duration', (totalBlackDuration / (1000 * blackTurns)).toFixed(3));
    }
  }

  const resetStats = () => {
    const ids = [
      'white-num-positions', 'white-move-time', 'white-position-rate',
      'white-total-positions', 'white-total-duration', 'white-avg-positions', 'white-avg-duration',
      'black-num-positions', 'black-move-time', 'black-position-rate',
      'black-total-positions', 'black-total-duration', 'black-avg-positions', 'black-avg-duration',
    ];
    ids.forEach(id => setText(id, 0));
  }

  /*
   * Board highlighting
   */
  const removeHighlights = () => {
    highlightedSquares.forEach(sq => board.removeCircle(sq));
    highlightedSquares = [];
  };

  const highlightSquare = (square) => {
    board.addCircle(square);
    highlightedSquares.push(square);
  };

  const onDragStart = (evt) => {
    // do not pick up pieces if the game is over
    // or if it's not that side's turn
    if (game.game_over() === true ||
        (game.turn() === 'w' && evt.piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && evt.piece.search(/^w/) !== -1)) {
      return false;
    }
  };

  const onDrop = (evt) => {
    removeHighlights();

    // see if the move is legal
    var move = game.move({
      from: evt.source,
      to: evt.target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return 'snapback';

    if ((game.turn() === 'w' && whiteIsComp()) || (game.turn() === 'b' && blackIsComp())) {
      window.setTimeout(() => makeMove(getBestMove()), 350);
    }
  };

  const onMouseenterSquare = (evt) => {
    // get list of possible moves for this square
    var moves = game.moves({
      square: evt.square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    highlightSquare(evt.square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      highlightSquare(moves[i].to);
    }
  };

  const onMouseleaveSquare = () => {
    removeHighlights();
  };

  const onSnapEnd = () => {
    board.position(game.fen());
  };

  const moves = (...args) => {
    return game.moves(...args);
  };

  const makeMove = (...args) => {
    let m = game.ugly_move(...args);
    if (m === null) {
      m = game.move(...args);
    }
    board.position(game.fen());
    checkGameOver();
    return !!m;
  };

  const checkGameOver = () => {
    if (game.game_over()) {
      const isDraw = game.in_draw();
      const whoWon = game.turn() === 'w' ? 'White wins.' : 'Black wins.';
      alert(`Game Over. ${ isDraw ? 'Draw.' : whoWon}`);
      setTimeout(() => startGame(), 1000);
    }
  }

  const undoMove = () => {
    game.undo()
    board.position(game.fen());
  }

  const startGame = () => {
    game = new Chess();
    totalWhitePositions = 0;
    totalWhiteDuration = 0;
    totalBlackPositions = 0;
    totalBlackDuration = 0;

    const config = {
      draggable: true,
      position: 'start',
      moveSpeed: 'fast',
      snapbackSpeed: 500,
      snapSpeed: 100,
      onDragStart: onDragStart,
      onDrop: onDrop,
      onMouseleaveSquare: onMouseleaveSquare,
      onMouseenterSquare: onMouseenterSquare,
      onSnapEnd: onSnapEnd,
    }
    board = window.Chessboard2(boardID, config);
    resetStats();
  };

  startGame();
  $('undo-button').addEventListener('click', undoMove);
  $('move-button').addEventListener('click', () => makeMove(getBestMove()));
  $('reset-button').addEventListener('click', () => startGame());

  return {game, board, moves, move: makeMove}
};

export default initBoard;
