/*
 *
 * Board highlighing is copied from Chessboard.js
 * Example # 5003
 * http://chessboardjs.com/examples#5003
 *
 */
import ChessBoard from 'chessboardjs';
import Chess from '../lib/chess.js';
import {alphaBetaSearch as alphaBetaIDS} from './alphabeta-ids';
import {alphaBetaSearch as alphaBetaOrdering} from './alphabeta-ordering';
import {alphaBetaSearch} from './alphabeta-direct';
import {minimaxSearch} from './minimax';


const initBoard = (boardID = 'board') => {
  let board;
  let game;
  let totalWhitePositions;
  let totalWhiteDuration;
  let totalBlackPositions;
  let totalBlackDuration;

  const blackIsComp = () => {
    return $('#black-player').find(':selected').attr('value') !== '0';
  }

  const blackSearch = (game, depth) => {
    const aiValue = parseInt($('#black-player').find(':selected').attr('value'));
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
    return  $('#white-player').find(':selected').attr('value') !== '0';
  }

  const whiteSearch = (game, depth) => {
    const aiValue = parseInt($('#white-player').find(':selected').attr('value'));
    if(aiValue === 1) {
      return minimaxSearch(game, depth);
    }
    if(aiValue === 2) {
      return alphaBetaSearch(game, depth);
    }
    if(aiValue === 3) {
      return alphaBetaOrdering(game, depth);
    }
    return alphaBetaSearch(game, depth);
  }

  const moveSearch = (game, depth) => {
    if(game.turn() === 'w') return whiteSearch(game, depth);
    return blackSearch(game, depth);
  }

  const getBestMove = () => {
    checkGameOver();

    const depth = game.turn() === 'w' ? parseInt($('#white-search-depth').find(':selected').text(), 10) : parseInt($('#black-search-depth').find(':selected').text(), 10);
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

  const updateStats = (turn, positions, duration, whiteTurns, blackTurns) => {
    if(turn === 'w'){
      totalWhiteDuration += duration;
      totalWhitePositions += positions;
      $('#white-num-positions').text(positions);
      $('#white-move-time').text(duration/1000);
      $('#white-position-rate').text(Math.floor(positions * 1000 / duration));
      $('#white-total-positions').text(totalWhitePositions);
      $('#white-total-duration').text(totalWhiteDuration/1000);
      $('#white-avg-positions').text(Math.round(totalWhitePositions/whiteTurns));
      $('#white-avg-duration').text((totalWhiteDuration / (1000 * whiteTurns)).toFixed(3));
    }
    else {
      totalBlackDuration += duration;
      totalBlackPositions += positions;
      $('#black-num-positions').text(positions);
      $('#black-move-time').text(duration/1000);
      $('#black-position-rate').text(Math.floor(positions * 1000 / duration));
      $('#black-total-positions').text(totalBlackPositions);
      $('#black-total-duration').text(totalBlackDuration/1000);
      $('#black-avg-positions').text(Math.round(totalBlackPositions/blackTurns));
      $('#black-avg-duration').text((totalBlackDuration / (1000 * blackTurns)).toFixed(3));
    }
  }

  /*
   * Start of board highlighting
   */
  var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
  };

  var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);
    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
      background = '#696969';
    }

    squareEl.css('background', background);
  };

  var onDragStart = function(source, piece) {
    // do not pick up pieces if the game is over
    // or if it's not that side's turn
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  };

  var onDrop = function(source, target) {
    removeGreySquares();

    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return 'snapback';

    if ((game.turn() === 'w' && whiteIsComp()) || (game.turn() === 'b' && blackIsComp())) {
      window.setTimeout(() => makeMove(getBestMove()), 250);
    }
  };

  var onMouseoverSquare = function(square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    greySquare(square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to);
    }
  };

  var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
  };

  var onSnapEnd = function() {
    board.position(game.fen());
  };
  /*
   * End of board highlighting
   */

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
      alert('Game Over');
      debugger;
      startGame();
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
      onMouseoutSquare: onMouseoutSquare,
      onMouseoverSquare: onMouseoverSquare,
      onSnapEnd: onSnapEnd,
    }
    board = ChessBoard(boardID, config);
    if(game.turn() === 'w' && whiteIsComp()) {
      setTimeout(() => makeMove(getBestMove()), 250);
    }
  };

  startGame();
  $('#undo-button').on('click', undoMove);
  $('#move-button').on('click', () => makeMove(getBestMove()));

  return {game, board, moves, move: makeMove}
};

export default initBoard;
