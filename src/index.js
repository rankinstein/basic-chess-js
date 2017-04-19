import Game from './game';
import * as AI from './ai';

const game = Game();
window.a = AI;
window.g = game;

const getBestMove = (game, ai) => {
  if (game.game.game_over()) {
    alert('Game Over');
  }

  const depth = parseInt($('#search-depth').find(':selected').text(), 10);
  const startTime = new Date().getTime();
  const {move: bestMove, positionsGenerated} = AI.alphaBetaSearch(game, depth);
  const endTime = new Date().getTime();
  const duration = endTime - startTime;
  const positionRate = positionsGenerated * 1000 / duration;

  $('#num-positions').text(positionsGenerated);
  $('#move-time').text(duration);
  $('#position-rate').text(positionRate);
  return bestMove;
}

window.m = getBestMove;

debugger



