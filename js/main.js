// Computer makes a move with algorithm choice and skill/depth level


var moveAudio = new Howl({
  src: ['../move-self.mp3'],
  volume: 0.5,
});

var diff = document.getElementById("search-depth");
function onChange() {
  var value = diff.value;
  var text = diff.options[diff.selectedIndex].text;
  return text;
}
diff.onchange = onChange;

var makeMove = function(algo, skill) {
  if (onChange() == "Easy") {
    skill = 1;
  }
  if (onChange() == "Medium") {
    skill = 2;
  }
  if (onChange() == "Hard") {
    skill = 4;
  }
  // exit if the game is over
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
  // Calculate the best move, using chosen algorithm
  if (algo === 1) {
    var move = randomMove();
  } else if (algo === 2) {
    var move = calcBestMoveOne(game.turn());
  } else if (algo === 3) {
    var move = calcBestMoveNoAB(skill, game, game.turn())[1];
  } else {
    var move = calcBestMove(skill, game, game.turn())[1];
  }
  game.move(move);
  // Update board positions
  board.position(game.fen());
}

// Computer vs Computer
var playGame = function(algo=4, skillW=2, skillB=2) {
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
  var skill = game.turn() === 'w' ? skillW : skillB;
  makeMove(algo, skill);
  window.setTimeout(function() {
    playGame(algo, skillW, skillB);
  }, 500);
};

// Handles what to do after human makes move.
// Computer automatically makes next move
var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // If illegal move, snapback
  if (move === null) return 'snapback';
  // Log the move
  console.log(move)

  if (game.turn() === "b") {
    moveAudio.play();
  }

  // make move for black
  window.setTimeout(function() {
    moveAudio.play();
    makeMove(4, diff.value);
  }, 2000);
};
