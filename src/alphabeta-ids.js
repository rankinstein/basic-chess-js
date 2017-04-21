/*
 * Alpha Beta search
 * White is always the maximizing player
 *   and black is always the minimizing player
 *
 */
import { countMaterial } from './board-eval';

let positionsGenerated = 0;
let Transpositions = {};
let pv = [] // pv is the principle variation i.e. the best line.
let initialHistory = []

export const alphaBetaSearch = (game, maxDepth) => {
  let bestMoveFound;
  const isMaximizingPlayer = game.turn() === 'w';
  const possibleMoves = getMoveOrder(game);
  pv = [];
  pv.a = -Infinity;
  pv.b = Infinity;
  positionsGenerated = 0;
  initialHistory = game.history();
  Transpositions = {};

  for(let depth = 1; depth <= maxDepth; depth++) {
    if(isMaximizingPlayer) {
      let bestMoveValue = -Infinity;
      for (let i = 0; i < possibleMoves.length; i += 1) {
        positionsGenerated += 1;
        const nextMove = possibleMoves[i];
        game.ugly_move(nextMove);
        let v = minValue(game, depth - 1, -Infinity, Infinity);
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
        const v = maxValue(game, depth - 1, -Infinity, Infinity);
        game.undo();
        if (v <= bestMoveValue) {
          bestMoveValue = v;
          bestMoveFound = nextMove;
        }
      }
    }
  }
  return {move: bestMoveFound, positionsGenerated};
}

const maxValue = (game, depth, a, b) => {
  if (cutoffTest(game, depth)) return evaluateState(game);
  let bestValue = -Infinity;
  const possibleMoves = getMoveOrder(game);
  for(let i = 0; i < possibleMoves.length; i += 1) {
    positionsGenerated += 1;
    game.ugly_move(possibleMoves[i]);
    const {alpha, beta} = checkTranspositions(game, a, b);
    const nextMin = minValue(game, depth - 1, alpha, beta)
    bestValue = Math.max(bestValue, nextMin);
    game.undo();
    if (bestValue >= beta) {
      return bestValue;
    }
    if(bestValue > alpha) {
      a = bestValue;
      setTransposition(game, alpha, beta);
    }
  }
  return bestValue;
}

const minValue = (game, depth, a, b) => {
  if (cutoffTest(game, depth)) return evaluateState(game);
  let bestValue = Infinity;
  const possibleMoves = getMoveOrder(game);
  for(let i = 0; i < possibleMoves.length; i += 1) {
    positionsGenerated += 1;
    game.ugly_move(possibleMoves[i]);
    const {alpha, beta} = checkTranspositions(game, a, b);
    const nextMax = maxValue(game, depth - 1, alpha, beta);
    bestValue = Math.min(bestValue, nextMax);
    game.undo();
    if (bestValue <= alpha) {
      return bestValue;
    }
    if(bestValue < beta) {
      b = bestValue;
      setTransposition(game, alpha, beta);
    }
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

const getPosition = (game) => {
  return game.fen().split(' ')[0];
}

const checkTranspositions = (game, alpha, beta) => {
  const t = Transpositions[getPosition(game)];
  return t || {alpha, beta};
}

const setTransposition = (game, alpha, beta) => {
  const trans = Transpositions[getPosition(game)];
  if (trans) {
    Transpositions[getPosition(game)] = {alpha: Math.max(alpha, trans.alpha),
                                         beta: Math.min(beta, trans.beta)};
  } else {
    Transpositions[getPosition(game)] = {alpha, beta}
  }
}

const getMoveOrder = (game) => {
  const moves = game.ugly_moves().sort((a, b) => {
    return a.flags === 2 && b.flags !== 2 ? -1 : 1;
  });
  return moves;
}

