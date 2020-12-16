var NUMBER_OF_WORDS = 20;
var SIZE_OF_GRID_X = 20;
var SIZE_OF_GRID_Y = 20;
var WORD_LIST = [
  { answer: 'frosty', clue: 'A famous snowman' },
  { answer: 'rudolph', clue: 'Has a red nose' },
  { answer: 'santa', clue: 'Wears a red suit' },
  { answer: 'turkey', clue: 'Xmas roast' },
  { answer: 'blankets', clue: 'Sausages that are cold - Pigs in ________' },
  { answer: 'snow', clue: 'Cold, clue: icy stuff' },
  { answer: 'cracker', clue: 'Pull it and get a prize' },
  { answer: 'holly', clue: 'Spiky leaves' },
  { answer: 'tinsel', clue: 'Shiny on the tree' },
  { answer: 'tree', clue: 'Real ones leave a mess on the floor' },
  {
    answer: 'twelfth', clue: 'It\'s considered unlucky to have decorations up after this time - _______ Night'
  },
  { answer: 'ladies', clue: 'On the ninth day of Christmas my true love gave to me? - ______ dancing' },
  { answer: 'mince', clue: 'You\'d think they were made from meat - _____ pies' },
  { answer: 'last', clue: 'Famous Christmas song recorded by Wham - ____ christmas' },
  { answer: 'holly', clue: 'Deck the halls with it' },
  { answer: 'sprouts', clue: 'Divisive festive vegetables' },
  { answer: 'cranberry', clue: 'Berry used for a seasonable condiment' },
  { answer: 'chimney', clue: 'Don\'t leave the fire on if you expect Santa to come down this' },
  {
    answer: 'bauble', clue: 'You\'d put these on your tree'
  },
  { answer: 'partridge', clue: 'Found in a fruit tree' },
  { answer: 'presents', clue: 'Find these under your tree' },
  { answer: 'scrooge', clue: 'Christmas grouch' },
  {
    answer: 'grinch', clue: 'He\'s a mean one'
  },
  { answer: 'candy', clue: 'Something sweet - not great to walk with - _____ cane' },
  { answer: 'gold', clue: 'On the fifth day of Christmas my true love gave these to me - ____ rings' },
  {
    answer: 'aid', clue: 'The groups of celebrities who asked "do they know it\'s Christmas?" - band ___'
  },
  { answer: 'elf', clue: 'A christmas movie starring Will Ferrell' },
  { answer: 'mistletoe', clue: 'Have a Christmas kiss under this' },
  { answer: 'dickens', clue: 'Surname of the famous author who wrote A Christmas Carol' },
  { answer: 'wham', clue: '80\'s band famous for the song "Last Christmas"' },
  { answer: 'wreath', clue: 'Something to hang on your door' },
  { answer: 'angel', clue: 'Sits on the top of your tree' },
  { answer: 'bells', clue: 'These were ringing out for Christmas day, according to The Pogues' },
  { answer: 'eggnog', clue: 'A creamy traditional Christmas drink' },
  { answer: 'stocking', clue: 'A large sock for gifts hung near the chimney' },
  { answer: 'bubble', clue: 'Leftovers you cook up and eat on Boxing Day - ______ and squeak' },
  { answer: 'sleigh', clue: 'Pulled by Vixen, Prancer, Rudolph and co' },
  { answer: 'pear', clue: 'The type of tree you find partridges in' },
  {
    answer: 'pantomime', clue: 'A trip to the theatre at Christmas, "oh no he didn\'t"'
  },
  { answer: 'snowman', clue: 'Built from snow with a carrot nose' },
  { answer: 'chimney', clue: 'Santa comes down this on Christmas Eve' },
  { answer: 'wizzard', clue: 'Band famous for the Christmas song, I wish it could be Christmas everyday' },
  { answer: 'slade', clue: '70\'s band famous for the Song "Merry Christmas Everybody"' },
  { answer: 'home', clue: 'Maccauley Culkin defends his home in this 90\'s Film "____ Alone"' },
  { answer: 'manger', clue: 'What baby jesus sleeps in, a makeshift crib' },
  { answer: 'ribbon', clue: 'Wrapped around the most fancy presents' },
  { answer: 'yule', clue: 'A delicious chocolate dessert - ____ log' },
  { answer: 'Gold', clue: 'Frankincense, myrrh and this were the gifts from the Three Kings' },
  { answer: 'miracle', clue: 'What happened on 34th Street' },
  { answer: 'pogues', clue: 'Band - Fairytale of New York - The ______' },
  { answer: 'star', clue: 'Wise men followed this' },
  { answer: 'pout', clue: 'You better not ____' },
  {
    answer: 'list', clue: 'He\'s checking this twice'
  },
  { answer: 'naughty', clue: 'He\'s going to find out who\'s been _______ or nice' },
  { answer: 'nice', clue: 'He\'s going to find out who\'s been naughty or ____' },
  {
    answer: 'coal', clue: 'What to expect if you\'re on the naughty list'
  },
  {
    answer: 'donkey', clue: 'Mary and Joseph\'s mode of transport'
  },
  { answer: 'brandy', clue: 'Spirit - used in making a dessert sauce }' }
];

var directions = {
  ACROSS: 'across',
  DOWN: 'down'
};

function extractRandomValueFrom(array) {
  var index = Math.floor(Math.random() * array.length);
  var clue = array[index];
  return {
    index: index,
    clue: clue
  };
}

function WordGrid(listOfWords) {

  var words = [];
  var numberOfPlacedWords = 0;
  var grid = [];

  function createGrid() {
    var grid = [];
    for (var yPos = 0; yPos < SIZE_OF_GRID_Y; yPos++) {
      var row = [];
      for (var xPos = 0; xPos < SIZE_OF_GRID_X; xPos++) {
        row.push('');
      }
      grid.push(row);
    }
    return grid;
  }

  function placeWord(word, x, y, isVertical) {
    if (isVertical) {
      for (var yOffset = 0; yOffset < word.answer.length; yOffset++) {
        grid[y + yOffset][x] = word.answer[yOffset];
      }
    } else {
      for (var xOffset = 0; xOffset < word.answer.length; xOffset++) {
        grid[y][x + xOffset] = word.answer[xOffset];
      }
    }

    words.push({
      number: numberOfPlacedWords,
      direction: isVertical ? directions.DOWN : directions.ACROSS,
      row: y,
      column: x,
      clue: word.clue,
      answer: word.answer
    });

    numberOfPlacedWords++;
  }

  function addFirstWord(word) {
    var start = Math.floor(SIZE_OF_GRID_X / 2);
    var offset = Math.floor(word.answer.length / 2);
    var index = start - offset;
    if (index < 0) {
      return false;
    }
    placeWord(word, start, index, true);
    return true;
  }

  function getLettersFor(word) {
    var letters = [];
    var middleOfWord = Math.floor(word.length / 2) - 1;

    for (var i = 0; i < word.length; i++) {
      var offset;
      if (i % 2) {
        offset = Math.ceil(i / 2);
      } else {
        offset = i * -0.5;
      }

      var index = middleOfWord + offset;
      if (!word[index]) {
        index = word.length - 1;
      }
      letters.push({
        letter: word[index],
        index: index
      });
    }

    return letters;
  }

  function hasRowAbove(y, offset) {
    offset = offset || 1;
    return (grid[y - offset]);
  }

  function hasRowBelow(y, offset) {
    offset = offset || 1;
    return (grid[y + offset]);
  }

  function rowExists(y, yOffset) {
    yOffset = yOffset || 0;
    return (grid[y + yOffset]);
  }

  function isEmptyAtPosition(x, y, xOffset, yOffset) {
    xOffset = xOffset || 0;
    yOffset = yOffset || 0;
    return (grid[y + yOffset][x + xOffset] === '');
  }

  function hasLetterAtPosition(x, y, xOffset, yOffset, letter) {
    xOffset = xOffset || 0;
    yOffset = yOffset || 0;
    return (grid[y + yOffset][x + xOffset] === letter);
  }


  function checkWordPosition(word, x, y, isVertical) {
    if (isVertical) {
      for (var i = -1; i < word.length + 1; i++) {
        if (!rowExists(y, i) || (!isEmptyAtPosition(x, y, null, i) && !hasLetterAtPosition(x, y, null, i, word[i])) ||
          ((!isEmptyAtPosition(x, y, 1, i) || !isEmptyAtPosition(x, y, -1, i)) && !hasLetterAtPosition(x, y, null, i, word[i]))) {
          return false;
        }
      }
    } else {
      1
      for (var i = -1; i < word.length + 1; i++) {
        if (!hasRowBelow(y) || !hasRowAbove(y) || (!isEmptyAtPosition(x, y, i) && !hasLetterAtPosition(x, y, i, null, word[i])) ||
          ((!isEmptyAtPosition(x, y, i, 1) || !isEmptyAtPosition(x, y, i, -1)) && !hasLetterAtPosition(x, y, i, null, word[i]))) {
          return false;
        }
      }
    }
    return true;
  }

  function fitWordByLetterPositionV(index, word, x, y) {
    var position;

    if ((!hasRowAbove(y) || isEmptyAtPosition(x, y, null, -1)) && (!hasRowBelow(y) || isEmptyAtPosition(x, y, null, 1))) {
      if (checkWordPosition(word, x, y - index, true)) {
        position = {
          x: x,
          y: y - index,
          isVertical: true
        };
      }
    }

    if ((!rowExists(y) || isEmptyAtPosition(x, y, -1)) && (!rowExists(y) || isEmptyAtPosition(x, y, 1))) {
      if (checkWordPosition(word, x - index, y)) {
        position = {
          x: x - index,
          y: y,
          isVertical: false
        };
      }
    }

    return position || false;
  }

  function fitWordByLetterPositionH(index, word, x, y) {
    var position;

    if (isEmptyAtPosition(x, y, -1) && isEmptyAtPosition(x, y, 1)) {
      if (checkWordPosition(word, x - index, y)) {
        position = {
          x: x - index,
          y: y,
          isVertical: false
        };
      }
    }

    if (isEmptyAtPosition(x, y, null, -1) && isEmptyAtPosition(x, y, null)) {
      if (checkWordPosition(word, x, y - index, true)) {
        position = {
          x: x,
          y: y - index,
          isVertical: true
        };
      }
    }

    return position || false;
  }

  function findLetterInRow(index, word, y) {
    for (var x = 0; x < grid[y].length; x++) {
      var cell = grid[y][x];
      if (cell === word[index]) {
        var position;
        position = fitWordByLetterPositionH(index, word, x, y);
        if (!position) {
          position = fitWordByLetterPositionV(index, word, x, y);
        }

        if (position) {
          return position;
        }
      }
    }
    return false;
  }

  function findPositionFor(letters, word) {
    var rows = [];

    for (var i = 0; i < SIZE_OF_GRID_Y; i++) {
      rows.push(i);
    }

    if (word.length % 2 !== 0) {
      rows.reverse();
    }

    for (var i = 0; i < rows.length; i++) {
      for (var j = 1; j < letters.length; j++) {
        var position = findLetterInRow(j, word, rows[i]);
        if (position) {
          return position;
        }
      }
    }
  }

  function addWord(word) {
    var letters = getLettersFor(word.answer);
    var position = findPositionFor(letters, word.answer);

    if (position) {
      placeWord(word, position.x, position.y, position.isVertical);
      return true;
    }

    return false;
  }

  function sortWords(wordList) {
    wordList.sort(function (first, second) { return second.answer.length - first.answer.length; });
  }

  function addWords(wordList) {

    wordList = wordList.slice();

    sortWords(wordList);
    var firstWord = extractRandomValueFrom(wordList)
    addFirstWord(firstWord.clue);
    wordList.splice(firstWord.index, 1);

    var wordsPlaced = 1;
    var iterations = 0;
    while (wordsPlaced < NUMBER_OF_WORDS && iterations < NUMBER_OF_WORDS * 3) {

      var entry = extractRandomValueFrom(wordList);

      if (!entry.clue.answer || entry.clue.answer.length === 0) {
        continue;
      }

      if (addWord(entry.clue)) {
        wordList.splice(entry.index, 1);
        wordsPlaced++;
      }
      iterations++;
    }

    if (wordsPlaced < NUMBER_OF_WORDS) {
      console.warn('Crossword: Unable to place all words');
    }
  }

  grid = createGrid();
  addWords(listOfWords)

  return {
    renderGrid: function () {
      function padToTwo(number) {
        if (number <= 9999) { number = ("00" + number).slice(-2); }
        return number;
      }
      var rendered = '[ +]';
      for (var y = 0; y < grid.length; y++) {

        rendered += '[' + padToTwo(y) + ']';
      }
      rendered += '\n';
      for (var y = 0; y < grid.length; y++) {
        rendered += '[' + padToTwo(y) + ']';
        for (var x = 0; x < grid[y].length; x++) {
          rendered += grid[y][x] === '' ? '[  ]' : '[ ' + grid[y][x] + ']';
        }
        rendered += '\n';
      }
      return rendered;
    },
    getGrid: function () { return grid; },
    getWords: function () { return words; }

  };

}

function CrosswordGame(wordGrid) {

  var grid = wordGrid.getGrid();
  var words = wordGrid.getWords();
  var state = {
    selected: null
  };
  var gameBoard = $('#crossword-board');
  var clues = $('#crossword-clues');
  var cluesDown = $('#crossword-clues-down');
  var cluesAcross = $('#crossword-clues-across');

  function createSelected(number, direction) {
    return { number: number, direction: direction };
  };

  function findCellAtPosition(x, y) {
    return gameBoard.find('.crossword__row').eq(y).find('.crossword__cell').eq(x);
  }

  function findLetterAtPosition(x, y) {
    return findCellAtPosition(x, y).find('input');
  }

  function updateScore() {
    var numberOfSolvedClues = $('#crossword-clues .crossword__clue--correct').length;
    $('#crossword-score').text('Solved ' + numberOfSolvedClues + ' out of ' + words.length + ' clues');
    if (numberOfSolvedClues === words.length) {
      $('#crossword-notification').removeClass('visually-hidden');
    } else {
      $('#crossword-notification').addClass('visually-hidden');
    }
  }

  // TODO: REFACTOR THIS
  function checkWordFor(cell) {
    function branchingWordIsValidFor(cell, direction) {
      var number = $(cell).data(direction);
      var word = gameBoard.find('[data-' + direction + '=' + number + ']');
      var correct = 0;
      word.each(function (i, letter) {
        if ($(letter).val().toLowerCase() === $(letter).data('letter').toLowerCase()) {
          correct++;
        }
      });
      return correct === word.length;
    }

    function checkLettersFor(letter) {
      if ($(letter).is('[data-across]') && $(letter).is('[data-down]')) {
        return branchingWordIsValidFor(letter, directions.ACROSS) || branchingWordIsValidFor(letter, directions.DOWN);
      } else if ($(letter).is('[data-across]')) {
        return branchingWordIsValidFor(letter, directions.ACROSS);
      } else if ($(letter).is('[data-down]')) {
        return branchingWordIsValidFor(letter, directions.DOWN);
      }
    }

    if ($(cell).is('[data-across]')) {
      var number = $(cell).data('across');
      var word = gameBoard.find('[data-across=' + number + ']');
      var clue = clues.find('#crossword-clues-across li[data-number=' + number + ']');
      var correct = 0;
      word.each(function (i, letter) {
        if (checkLettersFor(letter)) {
          $(letter).addClass('crossword__cell__input--correct');
          correct++;
        } else {
          $(letter).removeClass('crossword__cell__input--correct');
        }
      });
      if (correct === word.length) {
        clue.addClass('crossword__clue--correct');
      } else {
        clue.removeClass('crossword__clue--correct');
      }
    }

    if ($(cell).is('[data-down]')) {
      var number = $(cell).data('down');
      var word = gameBoard.find('[data-down=' + number + ']');
      var clue = clues.find('#crossword-clues-down li[data-number=' + number + ']');
      var correct = 0;
      word.each(function (i, letter) {
        if (checkLettersFor(letter)) {
          $(letter).addClass('crossword__cell__input--correct');
          correct++;
        } else {
          $(letter).removeClass('crossword__cell__input--correct');
        }
      });
      if (correct === word.length) {
        clue.addClass('crossword__clue--correct');
      } else {
        clue.removeClass('crossword__clue--correct');
      }
    }

    updateScore();
  }

  function getNextLetter() {
    var direction = state.selected.direction;
    var number = state.selected.number;
    var word = gameBoard.find('[data-' + direction + '=' + number + ']');
    var length = word.length;
    var index = word.index(this);
    if (index < length - 1) {
      gameBoard.find('[data-' + direction + '=' + number + ']').eq(index + 1).focus();
    }
  }

  function getPreviousLetter() {
    var direction = state.selected.direction;
    var number = state.selected.number;
    var word = gameBoard.find('[data-' + direction + '=' + number + ']');
    var index = word.index(this);
    if (index > 0) {
      gameBoard.find('[data-' + direction + '=' + number + ']').eq(index - 1).focus();
    }
  }

  function createClueClickHandler(number, word) {
    return function clueClickHandler() {
      findLetterAtPosition(word.column, word.row).focus();
      state.selected = createSelected(number, word.direction);
      gameBoard.find('.crossword__cell__input').removeClass('crossword__cell__input--selected');
      gameBoard.find('[data-' + word.direction + '=' + number + ']').addClass('crossword__cell__input--selected');
      clues.find('.crossword__clue').removeClass('crossword__clue--selected');
      $(this).addClass('crossword__clue--selected');
      $('#crossword-clues-current').text('' + number + '. ' + $(this).text());
    }
  }

  function createClue(number, word) {
    var clue = $('<li class="crossword__clue">' + word.clue + '</li>');
    clue.attr('data-number', number);
    clue.attr('data-direction', word.direction);
    clue.attr('data-word-id', word.number);
    clue.val(number);
    clue.on('click', createClueClickHandler(number, word));
    return clue;
  }

  function createInputClickHandler(number, word) {
    return function inputClickHandler(e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).focus();
      state.selected = createSelected(number, word.direction);
      gameBoard.find('.crossword__cell__input').removeClass('crossword__cell__input--selected');
      gameBoard.find('[data-' + word.direction + '=' + number + ']').addClass('crossword__cell__input--selected');
      clues.find('.crossword__clue').removeClass('crossword__clue--selected');
      var clue = clues.find('[data-word-id=' + word.number + ']');
      clue.addClass('crossword__clue--selected');
      $('#crossword-clues-current').text('' + number + '. ' + clue.text());
    }
  }

  function isTypeableCharacter(charCode) {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(charCode) > -1;
  }

  function createInputKeyDownHandler() {
    return function inputKeyDownHandler(e) {
      e.preventDefault();
      e.stopPropagation();
      var key = e.key.toUpperCase();

      if (key === 'BACKSPACE') {
        if ($(this).val().length > 0) {
          $(this).val('');
        } else {
          getPreviousLetter.call(this);
        }
      } else if (isTypeableCharacter(key)) {
        $(this).val(key);
        getNextLetter.call(this);
      }
    }
  }

  function addInputTo(cell, word, number, index) {
    if (cell.find('input').length === 0) {
      cell.append('<input class="crossword__cell__input" type="text" maxlength="1" />');
    }
    var input = cell.find('input');
    input.off('click').on('click', createInputClickHandler(number, word));
    input.off('blur').on('blur', function () { checkWordFor($(this)); })
    input.on('keydown', createInputKeyDownHandler(number, word));
    input.on('keyup', function () { checkWordFor(gameBoard.find('[data-' + word.direction + '=' + number + ']').eq(0)); });
    input.attr('data-' + word.direction, number);
    input.attr('data-' + word.direction + '-index', index);
    input.attr('data-letter', word.answer[index]);
  }

  function addLabelTo(cell, number) {
    var label = $('<span class="crossword__cell__label"></span>');
    label.text(number);
    label.appendTo(cell);
  }

  // build game grid;
  this.render = function () {

    gameBoard.empty();
    cluesAcross.empty();
    cluesDown.empty();
    $('#crossword-clues-current').text('Nothing selected');

    // render empty board
    for (var y = 0; y < grid.length; y++) {
      var row = $('<div class="crossword__row"></div>')
      for (var x = 0; x < grid[y].length; x++) {
        var cell = $('<div class="crossword__cell"></div>');
        cell.appendTo(row);
      }
      row.appendTo(gameBoard);
    }

    var down = [];
    var across = [];

    // add inputs and generate clues;
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var startOfWord = findCellAtPosition(word.column, word.row);
      var number;
      if (word.direction === directions.DOWN) {
        down.push(word);
        number = down.length;
      } else if (word.direction === directions.ACROSS) {
        across.push(word);
        number = across.length;
      }
      for (var j = 0; j < word.answer.length; j++) {
        var cell;
        if (word.direction === directions.DOWN) {
          cell = findCellAtPosition(word.column, word.row + j);
          addInputTo(cell, word, number, j);
        } else if (word.direction === directions.ACROSS) {
          cell = findCellAtPosition(word.column + j, word.row);
          addInputTo(cell, word, number, j);
        }
      }
    }

    // add labels to the start of each word
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var startOfWord = findCellAtPosition(word.column, word.row);
      var cellInput = startOfWord.find('input');
      number = cellInput.data(word.direction);
      addLabelTo(startOfWord, number);
      cellInput.off('click').on('click', createInputClickHandler(number, word));
    }

    // render down clues
    for (var j = 0; j < down.length; j++) {
      cluesDown.append(createClue(j + 1, down[j]));
    }

    // render across clues
    for (var j = 0; j < across.length; j++) {
      cluesAcross.append(createClue(j + 1, across[j]));
    }

    updateScore();
  }

  this.setupControls = function () {
    render = this.render.bind(this);
    $('#crossword-reset').on('click', function (e) {
      e.preventDefault();
      render();
    });
    $('#crossword-new-game').on('click', function (e) {
      e.preventDefault();
      var wg = new WordGrid(WORD_LIST);
      while (wg.getWords().length !== NUMBER_OF_WORDS) {
        wg = new WordGrid(WORD_LIST);
      }
      grid = wg.getGrid();
      words = wg.getWords();
      render();
    });
  }

}

(function () {
  var wg = new WordGrid(WORD_LIST);
  while (wg.getWords().length !== NUMBER_OF_WORDS) {
    wg = new WordGrid(WORD_LIST);
  }
  var game = new CrosswordGame(wg);
  game.render();
  game.setupControls();
})();
