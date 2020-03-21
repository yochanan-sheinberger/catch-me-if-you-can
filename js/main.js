const htmlIds = {
    startBtn: document.querySelector("button"),
    crush: document.getElementById("crush-them"),
    select: document.getElementById("Select-theme"),
    difficulty: document.getElementById("choose-difficulty"),
    spinImg: document.getElementById("spining-img"),
    gameBoard: document.getElementById("game-board"),
    score: {
        DOM: document.getElementById("score"),
        val: 0
    },
    points: {
        DOM: document.getElementById("points"),
        val: 10
    },
    level: {
        DOM: document.getElementById("level"),
        val: 1
    },
    missed: {
        DOM: document.getElementById("missed"),
        val: 0
    },
    timer: {
        DOM: document.getElementById("timer"),
        val: 60
    },
    highScore: document.getElementById("high-score"),
    successSound: document.getElementById("success"),
    failureSound: document.getElementById("failure"),
    insectSound: document.getElementById("insect")
};
console.log(htmlIds.highScore.val);

const vars = {
    highScorers: [{
        score: 0
    }],
    highScorersJSON: localStorage.getItem("highScore"),
    toAppend: "",
    timer: null,
    time: 300,
    spinSpeed: 2,
    hard: false,
    change: undefined
};

const startFuncs ={
    // removes the opening image reveals the select div, and calls for clearing score-board from prev round.
    selectTheme: ()=> {
        if (htmlIds.crush.style.display == "block") {
            htmlIds.crush.style.display = "none";
        } else {
            htmlIds.select.style.display = "block";
        };
        stopFuncs.resetScoreBoard();
    },
    // sets game theme to fly (spin img, bg-img, and sound) and calls for chooseDifficulty.
    selectFly: function() {
        htmlIds.spinImg.src = "images/fly.png";
        htmlIds.gameBoard.style.backgroundImage = "url(images/kitchen.jpg)";
        htmlIds.insectSound.src = "sound/fly.wav";
        this.chooseDifficulty();
    },
    // sets game theme to bee (spin img, bg-img, and sound) and calls for chooseDifficulty.
    selectBee: function() {
        htmlIds.spinImg.src = "images/bee.png";
        htmlIds.gameBoard.style.backgroundImage = "url(images/picnic.jpg)";
        htmlIds.insectSound.src = "sound/bee.wav";
        this.chooseDifficulty();
    },
    // sets game theme to mosquito (spin img, bg-img, and sound) and calls for chooseDifficulty.
    selectMosquito: function() {
        htmlIds.spinImg.src = "images/mosquito.png";
        htmlIds.gameBoard.style.backgroundImage = "url(images/bedroom.jpg)";
        htmlIds.insectSound.src = "sound/mosquito.wav";
        this.chooseDifficulty();
    },
    // removes select div and reveals difficulty div.
    chooseDifficulty: ()=> {
        htmlIds.select.style.display = "none";
        htmlIds.difficulty.style.display = "block";
    },
    // sets game mode to easy (spin-img size, change-position timing, spin-speed) and calls for startGame.
    setEasy: ()=> {
        htmlIds.spinImg.style.width = 90 + "px";
        htmlIds.spinImg.style.height = 65 + "px";
        vars.time = 400;
        vars.spinSpeed = 3;
        gameFuncs.startGame();
    },
    // sets game mode to normal (spin-img size, change-position timing, spin-speed) and calls for startGame.
    setNormal: ()=> {
        htmlIds.spinImg.style.width = 80 + "px";
        htmlIds.spinImg.style.height = 60 + "px";
        vars.time = 300;
        vars.spinSpeed = 2;
        gameFuncs.startGame();
    },
    // sets game mode to hard (spin-img size, change-position timing, spin-speed, additional chang-position) and calls for startGame.
    setHard: ()=> {
        htmlIds.spinImg.style.width = 70 + "px";
        htmlIds.spinImg.style.height = 50 + "px";
        vars.time = 250;
        vars.spinSpeed = 1.5;
        vars.hard = true;
        gameFuncs.startGame();
    },
};

const gameFuncs = {
    /* removes difficulty div. starts the game by confirmation. if confirmd, activates spining animatoin by adding duration,
    adds listeners to the bee and the game-board, disables the start button and calls for runTimer. 
    else resets opening image and select div. */
    startGame: function() {
        htmlIds.difficulty.style.display = "none";
        setTimeout( ()=> {
            var conf = confirm("Ready to start?");
            if (conf) {
                htmlIds.spinImg.style.animationDuration = vars.spinSpeed + "s";
                htmlIds.spinImg.addEventListener("click", gameFuncs.addScore);
                htmlIds.spinImg.addEventListener("mouseover", gameFuncs.changePosition);
                htmlIds.gameBoard.addEventListener("click", gameFuncs.reduceScore);
                htmlIds.startBtn.disabled = true;
                this.runTimer();
            } else {
                htmlIds.crush.style.display = "block";
                htmlIds.select.style.display = "block";
            }
        }, 20);
    },
    // runs the timer and calls for changePositionHard. when timer reaches 0, stops running and calls for stopGame.
    runTimer: function() {
        vars.timer = setInterval(()=>{
            htmlIds.timer.val--;
            htmlIds.timer.DOM.innerHTML = htmlIds.timer.val;
            if (htmlIds.timer.val == 0) {
                clearInterval(vars.timer);
                stopFuncs.stopGame();
            };
        }, 100);
        this.changePositionHard();
    },
    // plays success-sound. adds score, and calls for reducePoints when clicking on spin-img.
    addScore: ()=> {
        htmlIds.successSound.play();
        htmlIds.score.val += htmlIds.level.val * 10;
        htmlIds.score.DOM.innerHTML = htmlIds.score.val;
        gameFuncs.reducePoints();
    },
    // plays insect-sound and changes position of spin-img on-mouse-over
    changePosition: ()=> {
        setTimeout( ()=> {
            htmlIds.insectSound.play();
            htmlIds.spinImg.style.top = Math.random() * 92 + "%"; 
            htmlIds.spinImg.style.left = Math.random() * 93 + "%"; 
        }, vars.time);
    },
    // if game-mode-hard was chosen, changes position of spin-img every 3 sconds.
    changePositionHard: function() {
        if (vars.hard) {
            vars.change = setInterval( ()=> {
                this.changePosition();
            }, 3000);
        };
    },
    // plays failure-sound, reduces score, and increases missed clicks when clicking on game-board.
    reduceScore: ()=> {
        htmlIds.failureSound.play();
        htmlIds.score.val -= htmlIds.level.val;
        htmlIds.score.DOM.innerHTML = htmlIds.score.val;
        htmlIds.missed.val++;
        htmlIds.missed.DOM.innerHTML = htmlIds.missed.val;
    },
    // reduces points left to next level. when points value reaches 0, resets value and calls for stepUp.
    reducePoints: function() {
        htmlIds.points.val--;
        if (htmlIds.points.val == 0){
            htmlIds.points.val = 10;
        }
        htmlIds.points.DOM.innerHTML = htmlIds.points.val;
        this.stepUp(htmlIds.points.val);
    },
    // steps up levels, and Reduces time for spin-img positioning and spining. when level 5 finished, calls for stopGame.
    stepUp: (num)=> {
        if (num == 10) {
            if (htmlIds.level.val == 5) {
                clearInterval(timer);
                stopFuncs.stopGame();
                htmlIds.points.DOM.innerHTML = 0;
            } else {
                htmlIds.level.val++;
                htmlIds.level.DOM.innerHTML = htmlIds.level.val;
                vars.time -= 50;
                vars.spinSpeed -= 0.25;
                htmlIds.spinImg.style.animationDuration = vars.spinSpeed + "s";
                htmlIds.timer.val = parseInt(htmlIds.timer.DOM.innerHTML) + 10;
                clearInterval(vars.timer);
                console.log(htmlIds.timer.DOM.innerHTML);
                gameFuncs.runTimer();
            }
        }
    },
};

const stopFuncs = {
   /* stops spining animation, resets spin-img position, removes listeners from spin-img and game-board, 
       enables start buttun, stops hard-mode positioning, and calls for checkScore. */
    stopGame: function() {
        htmlIds.spinImg.style = "stop";
        htmlIds.spinImg.removeEventListener("click", gameFuncs.addScore);
        htmlIds.spinImg.removeEventListener("mouseover", gameFuncs.changePosition);
        htmlIds.gameBoard.removeEventListener("click", gameFuncs.reduceScore);
        htmlIds.startBtn.disabled = false;
        clearInterval(vars.change);
        this.checkScore();
    },
    // resets all score-board fields - except high-scores, select and difficulty divs, and hard-mode positioning.
    resetScoreBoard: ()=> {
        htmlIds.score.val = 0;
        htmlIds.score.DOM.innerHTML = 0;
        htmlIds.points.val = 10;
        htmlIds.points.DOM.innerHTML = 10;
        htmlIds.level.val = 1;
        htmlIds.level.DOM.innerHTML = 1;
        htmlIds.missed.val = 0;
        htmlIds.missed.DOM.innerHTML = 0;
        htmlIds.timer.val = 60;
        htmlIds.timer.DOM.innerHTML = 60;
        htmlIds.select.style.display = "block";
        htmlIds.difficulty.style.display = "none";
        vars.hard = false;
    },
    // creates date and if curent player score is heigher then last high-scorer calls for create player.
    checkScore: function() {
        let i = vars.highScorers.length - 1;
        let date = new Date();
        let formats = {month: "2-digit", day: "2-digit", year: "numeric"};
        if (htmlIds.score.val > vars.highScorers[i].score) {
            this.createPlayer(date, formats);
        }
    },
    // gets player name and creates an object that includs name, score and date. and calls for updateScorers.
    createPlayer: function(date, formats) {
        setTimeout( ()=>{
            let name = prompt("Enter your name");
            if (name) {
                var player = {
                        name: name,
                        score: htmlIds.score.val,
                        date:date.toLocaleDateString("en", formats)
                    };
                this.updateScorers(player);
            }
        }, 20);
    },
    // adds player to high-scores list on proper place. pops out lest scorer if list length is 6. and calls for createScoreList.
    updateScorers: function(player) {
        for (let i = 0; i < vars.highScorers.length; i++) {
            if (player.score > vars.highScorers[i].score) {
                vars.highScorers.splice(i, 0, player);
                break;
            }
        }
        if (vars.highScorers.length > 5) {
            vars.highScorers.pop();
        };
        this.createScoreList();
    },
    // resets scorers html. calls for addScorer, gets scorers html and uploading it to high-score field. than calls for updateLS.
    createScoreList: function() {
        toAppend = "";
        vars.highScorers.forEach(this.addScorer);
        htmlIds.highScore.innerHTML = toAppend;
        this.updateLS();
    },
    // createt html tags with high-scores details.
    addScorer: (scorer)=> {
        toAppend += `<span>${scorer.score} - ${scorer.name}
                         <span class="tooltiptext">${scorer.date}</span>
                     </span></br>`;
    },
    // stringifys high-scorers array and stores it on local storage.
    updateLS: ()=> {
        vars.highScorersJSON = JSON.stringify(vars.highScorers);
        localStorage.setItem("highScore", vars.highScorersJSON);
    }
};

if (vars.highScorersJSON != null) {
    vars.highScorers = JSON.parse(vars.highScorersJSON);
    stopFuncs.createScoreList();
}

