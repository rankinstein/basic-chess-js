const VALUE = {
  p: 100,
  r: 500,
  n: 300,
  b: 300,
  q: 1000,
  k: 99999,
}

/*
 * Alpha Beta search
 * White is always the maximizing player
 *   and black is always the minimizing player
 *
 */

let positionsGenerated = 0;
let bestAtDepth = [];

export const alphaBetaSearch = (game, maxDepth) => {
  let bestMoveFound;
  const isMaximizingPlayer = game.turn() === 'w';
  const possibleMoves = getMoveOrder(game);
  positionsGenerated = 0;

  for(let depth = 1; depth <= maxDepth; depth++) {
    if(isMaximizingPlayer) {
      let bestMoveValue = -Infinity;
      for (let i = 0; i < possibleMoves.length; i += 1) {
        positionsGenerated += 1;
        const nextMove = possibleMoves[i];
        game.ugly_move(nextMove);
        let v = minValue(game, depth - 1, -Infinity, Infinity);
        game.undo();
        if (v > bestMoveValue) {
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
        if (v < bestMoveValue) {
          bestMoveValue = v;
          bestMoveFound = nextMove;
        }
      }
    }
  }
  return {move: bestMoveFound, positionsGenerated, bestAtDepth};
}

const maxValue = (game, depth, alpha, beta) => {
  if (cutoffTest(game, depth)) return evaluateState(game);
  let bestValue = -Infinity;
  const possibleMoves = getMoveOrder(game);
  for(let i = 0; i < possibleMoves.length; i += 1) {
    positionsGenerated += 1;
    game.ugly_move(possibleMoves[i]);
    const nextMin = minValue(game, depth - 1, alpha, beta)
    bestValue = Math.max(bestValue, nextMin);
    game.undo();
    if (bestValue >= beta) {
      return bestValue;
    }
    alpha = Math.max(alpha, bestValue);
  }
  return bestValue;
}

const minValue = (game, depth, alpha, beta) => {
  if (cutoffTest(game, depth)) return evaluateState(game);
  let bestValue = Infinity;
  const possibleMoves = getMoveOrder(game);
  for(let i = 0; i < possibleMoves.length; i += 1) {
    positionsGenerated += 1;
    game.ugly_move(possibleMoves[i]);
    const nextMax = maxValue(game, depth - 1, alpha, beta);
    bestValue = Math.min(bestValue, nextMax);
    game.undo();
    if (bestValue <= alpha) {
      return bestValue;
    }
    beta = Math.min(beta, bestValue);
  }
  return bestValue;
}

const cutoffTest = (game, depth) => {
  if (depth === 0) return true;
  return false;
}

const evaluateState = (game) => {
  return countMaterial(game.board());
}

const getMoveOrder = (game) => {
  const moves = game.ugly_moves().sort((a, b) => {
    const best = bestAtDepth[bestAtDepth.length - 1];
    if(best && a.from === best.from && a.to === best.to) return -1;
    if(best && b.from === best.from && b.to === best.to) return 1;
    return a.flags === 2 && b.flags !== 2 ? -1 : 1;
  });
  return moves;
}

export const countMaterial = (board) => {
  const value = board.reduce((acc, val, index, array) => {
    return acc + val.reduce((acc, val, index, array) => {
      if (val === null) return acc;
      const owner = val.color === 'w' ? 1 : -1;
      const cost = owner * VALUE[val.type];
      return acc + cost;
    }, 0);
  }, 0);
  return value;
}

