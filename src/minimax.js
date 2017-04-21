/*
 * Minimax search
 * White is always the maximizing player
 *   and black is always the minimizing player
 *
 */
import { countMaterial } from './board-eval';

let positionsGenerated = 0;

export const minimaxSearch = (game, depth) => {
  let bestMoveFound;
  const isMaximizingPlayer = game.turn() === 'w';
  const possibleMoves = getMoveOrder(game);
  positionsGenerated = 0;

  if(isMaximizingPlayer) {
    let bestMoveValue = -Infinity;
    for (let i = 0; i < possibleMoves.length; i += 1) {
      positionsGenerated += 1;
      const nextMove = possibleMoves[i];
      game.ugly_move(nextMove);
      let v = minValue(game, depth - 1);
      game.undo();
      if (v >= bestMoveValue) {
        bestMoveValue = v;
        bestMoveFound = nextMove;
      }
    }
  } else {
    let bestMoveValue = Infinity;
    for (let i = 0; i < possibleMoves.length; i += 1) {
      positionsGenerated += 1;
      const nextMove = possibleMoves[i];
      game.ugly_move(nextMove);
      const v = maxValue(game, depth - 1);
      game.undo();
      if (v <= bestMoveValue) {
        bestMoveValue = v;
        bestMoveFound = nextMove;
      }
    }
  }
  return {move: bestMoveFound, positionsGenerated};
}

const maxValue = (game, depth) => {
  if (cutoffTest(game, depth)) return evaluateState(game);
  let bestValue = -Infinity;
  const possibleMoves = getMoveOrder(game);
  for(let i = 0; i < possibleMoves.length; i += 1) {
    positionsGenerated += 1;
    game.ugly_move(possibleMoves[i]);
    const nextMin = minValue(game, depth - 1);
    bestValue = Math.max(bestValue, nextMin);
    game.undo();
  }
  return bestValue;
}

const minValue = (game, depth) => {
  if (cutoffTest(game, depth)) return evaluateState(game);
  let bestValue = Infinity;
  const possibleMoves = getMoveOrder(game);
  for(let i = 0; i < possibleMoves.length; i += 1) {
    positionsGenerated += 1;
    game.ugly_move(possibleMoves[i]);
    const nextMax = maxValue(game, depth - 1);
    bestValue = Math.min(bestValue, nextMax);
    game.undo();
  }
  return bestValue;
}

const cutoffTest = (game, depth) => {
  if (depth === 0) return true;
  if (game.game_over()) return true;
  return false;
}

const evaluateState = (game) => {
  return countMaterial(game.board());
}

const getMoveOrder = (game) => {
  return game.ugly_moves();
}

