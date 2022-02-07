/****************************
 * anagramica
 *
 *  Copyright 2011, Max Irwin (@binarymax)
 *
 ****************************/
"use strict";

var anagramica = window.anagramica || {};
if (!anagramica.core) {

	anagramica.core = (function() {

		var subscribers = {};
		var subscribe = function(type,name,callback){
			if(!subscribers[type]) subscribers[type] = [];
			subscribers[type].push({name:name,callback:callback});
		};
		
		var unsubscribe = function(type,name){
			var subs = subscribers[type];
			if(subs instanceof Array) {
				for(var i=0,l=subs.length;i<l;i++) {
					if(subs[i].name===name) {
						subs.splice(i,1);
						l--;
					}
				}
			}
		};

		var notify = function(type,data){
			var subs = subscribers[type];
			if(subs instanceof Array) {
				for(var i=0,l=subs.length;i<l;i++) {
					subs[i].callback(data);
				}
			}
		};

    var postResults = function(letters, words){
      $.post(
        '/games/anagramica',
        { letters, words },
        anagramica.game.displayResults
      )
    }

		return {
      postResults,
			notify,
			subscribe,
			unsubscribe
		};

	})();

}


if (!anagramica.game) {

	anagramica.game = (function() {

		var gameTypes		= {manual:0,automatic:1}; 
		var gameStates		= {loading:1,waiting:2,letters:3,words:4,checking:5};
		var currGameState = gameStates.loading;

		var boardletters 	= ""; //Letters currently on the board
		var timelimit		= 45; //Starting Time limit in seconds
		var gametype		= gameTypes.automatic;	
		var score 			= 0;  //Player's running total score
		var high				= 0;  //Player's highest score
		var best				= []; //Best possible anagrams
		var all				= []; //All possible anagrams

		var consonants 		= "BCDFGHJKLMNPQRSTVWXYZ";
		var consonantpoints	= "222322432212511133534";  //see about page for letter scores

		var vowels 				= "AEIOU";
		var vowelpoints		= "11112";
		
		var limit 			= 2;
		
		var letterpoints 	= [];		
		
		for(var i=0,l=consonants.length;i<l;i++) {
			letterpoints[consonants.charAt(i)] = parseInt(consonantpoints.charAt(i));
		}
		for(var i=0,l=vowels.length;i<l;i++) {
			letterpoints[vowels.charAt(i)] = parseInt(vowelpoints.charAt(i));
		}
		
		var exceedsLimit = function(letter) {
			var tmp = 0;
			for(var i=0,l=boardletters.length;i<l;i++) {
				if(boardletters.charAt(i)==letter) tmp++;
				if(tmp>=limit) return true;
			}
			return false;
		}		
		
		//Gets a consonant and adds it to the board letters
		var getConsonant = function() {
			var index = parseInt(Math.random()*consonants.length);
			var letter = consonants.charAt(index);
			if(exceedsLimit(letter)) while(!exceedsLimit(letter = consonants.charAt(parseInt(index=Math.random()*consonants.length))));
			boardletters+=letter;
			return {letter:letter,points:letterpoints[letter]};
		};

		//Gets a vowel and adds it to the board letters
		var getVowel = function() {
			var index  = parseInt(Math.random()*vowels.length);
			var letter = vowels.charAt(index);
			if(exceedsLimit(letter)) while(!exceedsLimit(letter = vowels.charAt(parseInt(index=Math.random()*consonants.length))));
			boardletters+=letter;
			return {letter:letter,points:letterpoints[letter]};
		};
				

		//Checks if a word only contains letters from the board
		var validWord = function(word) {
			var a = boardletters.split('');
			var i=0,j=-1,
				w=word.toUpperCase(),
				wl=word.length,
				bl=boardletters.length;

			while(i<wl && i<bl && (j=a.indexOf(w.charAt(i)))>-1) {
				//Letter found on the board, use it up!
				a.splice(j,1);
				i++;
			}
			
			if (i!==wl) {
				//Word contains letters not on the board
				return false;
			}
			
			return true;
		}
		
		//Returns the point value of the letter
		var letterWorth = function(letter) {
			return letterpoints[letter.toUpperCase()] || 1;
		};		
		
		//Checks if a word is valid and in the dictionary and assigns a score
		var scoreWord = function(word, bonusModifier) {
				return word.split('').reduce((tot, letter) => tot+=letterWorth(letter), 0) * bonusModifier;
		};

		var getRemaining = function(best = '', letters) {
      if(!best?.length) return '';
      var word = best.toLowerCase().split('');
      const remaining = letters.toLowerCase().split('');
      return remaining.filter(letter => {
        const index = word.findIndex(wordLetter => wordLetter === letter);
        if(index == -1) return true
        word.splice(index, 1);
        return false;
      });
		};

		var startTimer = function(seconds) {
			//start the timer, notify per tick
			var limit = (seconds||30) * 1000;
			var start = new Date();
			var elapsed = 0;
			anagramica.core.notify("starttimer",start);
			var inter = setInterval(function() {
				//tick and notify the controller
				elapsed = (new Date()) - start;
				anagramica.core.notify("tick",{elapsed:elapsed,percent:(elapsed/limit)*100});

				if (elapsed>=limit) { 
					//time up!
					clearInterval(inter);
					endTimer();

				}

			},5);
		};
		
		var endTimer = function(){
			//end the timer
			anagramica.core.notify("endtimer");
		};
				
		//Reset the game
		var reset = function(){
			if(score>high) anagramica.core.notify("high",high=score);
			anagramica.core.notify("score",score);
			boardletters = "";
			score	= 0;
			best	= [];
			all	= [];	
			currGameState = gameStates.checked;
			anagramica.core.notify("gamestate",currGameState);
		};
		var getGameState = function() {
			return currGameState;
		};		 
		var getGameType = function() {
			return gametype;
		};		 

		var init = function(){			
			anagramica.core.notify("gamestate",currGameState);
			
			anagramica.core.subscribe("gametype","game",function(type) {
				gametype = type;
			});

			anagramica.core.subscribe("timelimit","game",function(limit) {
				timelimit = limit;
			});			
			
			anagramica.core.subscribe("points","score",function(points){
				score+=points;
				anagramica.core.notify("score",score);
			});
			
			anagramica.core.subscribe("loaded","game",function(){
				currGameState = gameStates.waiting;
				anagramica.core.notify("gamestate",currGameState);
			});

			anagramica.core.subscribe("started","game",function(){
				currGameState = gameStates.letters;
				anagramica.core.notify("gamestate",currGameState);
			});
			
			anagramica.core.subscribe("chosen","game",function(){
				currGameState = gameStates.words;
				anagramica.core.notify("gamestate",currGameState);
				anagramica.game.startTimer($('#timelimit .govuk-radios__input:checked').val());
			});

			anagramica.core.subscribe("checked","game",function(){
				reset();				
			});

		}; 

    var checkResults = function() {
      $(".scratch").hide();
			$(".answer input").attr("readonly",true);
      anagramica.core.postResults(
        boardletters.toLowerCase(), 
        $(".word:not(.moj-badge--red) .text")
          .toArray()
          .map(({ innerText }) => innerText)
          .filter(validWord)
      );
    }
    var displayResults = function(data) {
      anagramica.ui.showBest(data?.best[0], data?.letters);
      anagramica.ui.showScores(data?.scores, data?.best[0]?.length);

    }
		return {
			getConsonant:getConsonant,
			getVowel:getVowel,
			validWord:validWord,
			letterWorth:letterWorth,
			scoreWord:scoreWord,
			startTimer:startTimer,
			gameStates:gameStates,
			getGameState:getGameState,
			gameTypes:gameTypes,
			getGameType:getGameType,
			reset:reset,
			init:init,
      checkResults,
      displayResults,
      getRemaining,
		}
		
	})();
}

if (!anagramica.ui) {
	anagramica.ui = (function() {
		
		var instructions = true;

		//Fancy flip the board letter
		function setLetter(target,letter,grey){
			target.removeClass("flip").removeClass("flop").addClass("flip"); //style the letter
			
			setTimeout(function(){
				if(typeof letter == "object") {
					if (letter && letter.letter.length) {
						target.addClass(!grey?"ready":"remaining");
						target.text(letter.letter.toUpperCase());
						target.data("points",letter.points);
					}
				} else {
					if (letter && letter.length) {
						target.addClass(!grey?"ready":"remaining");
						target.text(letter.toUpperCase());
					}
				}
				target.addClass("flop");

			},150); //set the board letter text
		}

		//Fancy flip the board letter
		function clearLetter(target){
			target.removeClass("flip").removeClass("flop").addClass("flip"); //style the letter
			setTimeout(function(){
				target.text("").removeClass("ready").removeClass("remaining").addClass("flop");
			},150); //clear the board letter text
		}

		//Freeze the board, show the input
		function freezeBoard() {
			$("#consonant,#vowel").hide();
			$(".scratch").show();
			$(".answer input:first").focus().val('');
		}

		//reset the letter board
		var clearBoard = function(callback) {
			var i=0,j=0;
			$(".letter").each(function(){
				var target = $(this);
				setTimeout(function(){
					clearLetter(target);
					if(++i==10) if(callback) callback();
				},j++*100);
			});
		}

		//Gets the next random letter and sends it to the board
		var nextGameLetter = function() {

				var target = $(".letter:not(.ready):first"); //get the first blank letter
	
				if(target.length) {
					//if the board is not filled up...

					var letter = '';
					if ($(this).hasClass("consonant")) {
						letter = anagramica.game.getConsonant();
					} else if ($(this).hasClass("vowel")) { 
						letter = anagramica.game.getVowel();
					}
					//set letter depending on type
					setLetter(target,letter);
					
				}
				if(!target.length || $(".letter:not(.ready)").length === 1) {
					freezeBoard();
					anagramica.core.notify("chosen");
				}

		}

		//Automatically chooses the game letters
		var autoLetters = function() {
			//clearBoard(function(){
				var sequence = "1101010110".split('');
				var j=0,s=0,k=0;
				$(".letter").each(function(){
				
					var seq = sequence[s++];

					var letter = '';
					if (seq=="1") {
						letter = anagramica.game.getConsonant();
					} else { 
						letter = anagramica.game.getVowel();
					}
					
					//set letter depending on type
					var self=$(this);
					setTimeout(function(){
						(function(){
							setLetter($(this.target),this.letter);
							if(k++==9) {
								setTimeout(function(){
									freezeBoard();
									anagramica.core.notify("chosen");
								},1500);
							}
						}).call({target:self,letter:letter});
					},s*150);
					
				});
			//});
		};
		
		//sends a message to the letter board
		var messageLetters = function(text,callback) {
			if(text.length>10) return false;
			clearBoard();
			var letters = text.split('');
			var i=0,j=0,l=text.length;
			$(".letter").each(function(){
				var target = $(this);
				setTimeout(function(){
					setLetter(target,letters[i++]||'');
					if(i==l) if(callback) setTimeout(callback,750);
				},j++*100);
			});
		};

		//sends a message to the letter board
		var remainingLetters = function(letters) {
			if(letters.length>10) return false;
			var i=0,j=0,l=letters.length;
			$(".letter:not(.ready)").each(function(){
				var target = $(this);
				setTimeout(function(){
					setLetter(target,letters[i++]||'',true);
				},j++*100);
			});
		};


    var showScores = function(scores, bestLength) {
			$(".word").each(function() {
				var word = $(this);
				var txt = word.find(".text");
				var val = word.find(".value");
        const text = txt.text();
        const found = (anagramica.game.validWord(text) && scores[text]) ? scores[text] : 0;

        const bonus = found && text.length === bestLength
				const score = anagramica.game.scoreWord(text, bonus ? 2 : 1);
        word.removeClass(["moj-badge--red", "moj-badge--grey"]);

        if(found===1) {
          val.text('+' + score);
          anagramica.core.notify("points",score);
          if(bonus){
            //Bonus!  Longest word found
            word.addClass("moj-badge--green");
          } else if(found===1) {
            //player gains more points for longer words
            word.addClass("moj-badge--blue");
          }			
        } else {
          //player loses more points for shorter words
          word.addClass("moj-badge--red");
          val.text('-' + score);
          anagramica.core.notify("points",0-score);						
        }
			});
      showNewGame();
      anagramica.core.notify("checked");
		};
		
		var showBest = function(best, letters) {
      if(best?.length)
        messageLetters(best,function(){
          remainingLetters(anagramica.game.getRemaining(best, letters));
        });
		};
		
		function startGame() {			
			$("#consonant,#vowel").show();
			$(".scratch").hide();
			$(".word").remove();
			$(".answer input").attr("readonly",null);
			anagramica.core.notify("score",0);
			anagramica.core.notify("started");
			if($('#gametype .govuk-radios__input:checked').val()==anagramica.game.gameTypes.automatic) {
				autoLetters();
			}
		}

		var newGame = function() {
			$(".scratch").hide();
			$(".word").remove();
			hideNewGame();
			anagramica.ui.clearBoard(anagramica.ui.startGame);
		}
		
		var setGameOption = function() {
			var li = $(this);

			var pr = li.parents("div:first");
			anagramica.core.notify(pr.attr("id"),parseInt(li.attr("data-value")));
			li.addClass("selected");
			li.siblings().each(function(){
				$(this).removeClass("selected");
			});
		}

		var showNewGame = function() {
			$(".newGame").show();
			$("#options").show();
		};
		
		var hideNewGame = function() {
			$(".newGame").hide();
			$("#options").hide();
		};


		var handleKeys = function(e){

			if(anagramica.game.getGameState() == anagramica.game.gameStates.letters) {
				//Choose letters for the board
				var cons = "cC",vowl = "vV";
				if(e.which==cons.charCodeAt(0) || e.which==cons.charCodeAt(1)) {
					$("#consonant").trigger("click");				
				}
				if(e.which==vowl.charCodeAt(0) || e.which==vowl.charCodeAt(1)) {
					$("#vowel").trigger("click");
				}
			}

			if(anagramica.game.getGameState() == anagramica.game.gameStates.waiting  || anagramica.game.getGameState() == anagramica.game.gameStates.checked) {
				if(e.which==32) {
					//Space Bar to start a new game
					newGame();				
				}

			}

		}
		
		var handleLetterTouch = function() {
			var letter = $(this).text();
			$(".answer input").val($(".answer input").val()+letter);
		};
		
		var handleAnswerTouch = function(e) {
			e.preventDefault();
			handleAnswer.apply(this,[{which:13}]);
			$(this).blur();
			return false;
		};

		//Handles keypress event for answer input
		var handleAnswer = function(e){
			
			//The entered word
			var word = $(this).val().toLowerCase();
			
			//Enter or tab pressed
			if(word && word.length && (e.which===13 || e.which===27)) {
				
				//Make sure word is not a duplicate
				var exists = false;
				$(".word").each(function() { if(word === $(this).find(".text").text()) exists=true; });

				if(!exists) {
	
					//Save word and clear input.
					var ok = (!anagramica.game.validWord(word))?' moj-badge--red':'moj-badge--grey'; 
					$("#words").append(`<span class="word govuk-!-margin-1 moj-badge moj-badge--large ${ok} "><span class="text">${word}</span> | <span class="value">?</span></div>`);

				}

				//Clear input and refocus
				$(this).val('').focus();
			}
		}
		
		var ready = function(){
      $(".initiallyHidden").removeClass('initiallyHidden');
			showNewGame();
			anagramica.core.notify("loaded");
		}

		//Initializes the UI.
		//Only call this once when DOM is ready.		
		function init() {

			anagramica.core.subscribe("starttimer","timer",function(){
				$(".elapsed").css("min-width","0%");
			});

			anagramica.core.subscribe("tick","timer",function(data){
				$(".elapsed").css("min-width",data.percent + "%");				
			});

			anagramica.core.subscribe("endtimer","timer",function(){
        anagramica.game.checkResults();
			});
			
			anagramica.core.subscribe("score","scoreboard",function(score){
				$(".score-container").text(score);
			});
			
			anagramica.core.subscribe("high","scoreboard",function(high){
				$(".best-container").text(high);
			});

			anagramica.core.subscribe("gamestate","instructions",function(gameState){
				//Show the proper instructions text:

				$(".newGame").hide();

				switch(gameState) {

					case anagramica.game.gameStates.loading:
						$(".newGame").show();
						$("#intro").show();
						$("#choose").hide();
						$(".scratch").hide();

						break;

					case anagramica.game.gameStates.waiting:
						$(".newGame").show();				
						$("#intro").show();
						$("#choose").hide();
						$(".scratch").hide();
						break;

					case anagramica.game.gameStates.letters: 
						if($('#gametype .govuk-radios__input:checked').val()==anagramica.game.gameTypes.manual) {
							$("#choose").show();
						} else {
							$("#choose").hide();
						}
						break;

					case anagramica.game.gameStates.words:
						$("#answer").show();
						$("#choose").hide();
						break;

					case anagramica.game.gameStates.checked:
						$(".newGame").show();
						$("#points").show();
						$("#choose").hide();
						break;

				};
			});


			//Consonant/Vowel choice by button or keypress
			$(".consonant,.vowel").on("click",nextGameLetter);
			$(document).bind("keypress",handleKeys);
						
			//Answer text input keypress
			$(".answer input").bind("keypress",handleAnswer);
						
			$(".newGame").on("click ontouchstart",newGame);
			$("#options .govuk-radios__input").on("click",setGameOption);
			
			if('ontouchstart' in window){
				//Touch based UI's
				$(".letter").on("touchstart",handleLetterTouch);
				$(".answer input").on("click",handleAnswerTouch);
				$(".answer input").attr("readonly","readonly");	
			}

		}
		
		return {
			clearBoard:clearBoard,
			messageLetters:messageLetters,
			nextGameLetter:nextGameLetter,
			startGame:startGame,
      showBest,
      showScores,
			init:init,
			ready:ready
		}
	})();
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj) {
		for(var i=0,l=this.length;i<l;i++) {
			if (this[i]===obj) return i;
		}
		return -1;
	}
}
