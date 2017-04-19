/*
 *
 * Board highlighing is copied from Chessboard.js
 * Example # 5003
 * http://chessboardjs.com/examples#5003
 *
 */
import ChessBoard from 'chessboardjs';
import Chess from '../lib/chess.js';
import {alphaBetaSearch} from './ai';


const initBoard = (boardID = 'board') => {
  let board;
  const game = new Chess();

  const blackIsComp = () => {
    return $('#black-player').find(':selected').attr('value') === '1';
  }

  const whiteIsComp = () => {
    return  $('#white-player').find(':selected').attr('value') === '1';
  }

  const getBestMove = () => {
    if (game.game_over()) {
      alert('Game Over');
    }

    const depth = parseInt($('#search-depth').find(':selected').text(), 10);
    const startTime = new Date().getTime();
    const {move: bestMove, positionsGenerated} = alphaBetaSearch(game, depth);
    const endTime = new Date().getTime();
    const duration = endTime - startTime;
    const positionRate = positionsGenerated * 1000 / duration;

    $('#num-positions').text(positionsGenerated);
    $('#move-time').text(duration);
    $('#position-rate').text(positionRate);
    return bestMove;
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
    const m = game.move(...args);
    board.position(game.fen());
    return !!m;
  };

  const config = {
    draggable: true,
    position: 'start',
    moveSpeed: 'slow',
    snapbackSpeed: 500,
    snapSpeed: 100,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd,
  }
  board = ChessBoard(boardID, config);
  
  return {game, board, moves, move: makeMove}
};

export default initBoard;
