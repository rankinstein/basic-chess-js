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
export const alphaBetaSearch = (GameState, depth) => {
  const { game } = GameState;
  
  if(game.turn() === 'w') {
    return maxValue(game, depth, -Infinity, Infinity);
  } else {
    return minValue(game, depth, -Infinity, Infinity);
  }
}

const maxValue = (game, depth, alpha, beta) => {
  if (cutoffTest(game, depth)) return evaluateState(game);
  let bestValue = {value: -Infinity, line: []};
  const possibleMoves = getMoveOrder(game);
  for(let i = 0; i < possibleMoves.length; i += 1) {
    game.move(possibleMoves[i]);
    const nextMin = minValue(game, depth - 1, alpha, beta)
    bestValue = bestValue.value > nextMin.value ? bestValue : nextMin;
    game.undo();
    if (bestValue.value >= beta) return bestValue;
    alpha = alpha > bestValue.value ? alpha : bestValue.value;
  }
  return bestValue;
}

const minValue = (game, depth, alpha, beta) => {
  if (cutoffTest(game, depth)) return evaluateState(game);
  let bestValue = {value: Infinity, line: []};
  const possibleMoves = getMoveOrder(game);
  for(let i = 0; i < possibleMoves.length; i += 1) {
    game.move(possibleMoves[i]);
    const nextMax = maxValue(game, depth - 1, alpha, beta);
    bestValue = bestValue.value < nextMax.value ? bestValue : nextMax;
    game.undo();
    if (bestValue <= alpha) return bestValue;
    beta = Math.min(beta, bestValue);
  }
  return bestValue;
}

const cutoffTest = (game, depth) => {
  if (depth === 0) return true;
  return false;
}

const evaluateState = (game) => {
  return {value: countMaterial(game.board()), line: game.history()};
}

const getMoveOrder = (game) => {
  return game.moves();
}

export const calculateBestMove = (Game) => {
  const { game } = Game;
  const possibleMoves = game.moves();
  const turn = game.turn() === 'w' ? 1 : -1;
  let bestValue = -1 * turn * 1000000;

  possibleMoves.forEach(move => {
    game.move(move);
    const boardValue = countMaterial(game.board())
    bestValue = Math.max(bestValue, boardValue);
    game.undo();
  })
  debugger;
  return bestValue;
};

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

