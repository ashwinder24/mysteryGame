var express = require('express')
var app = express()
var path = require('path');
var session = require('express-session')
var bodyParser = require('body-parser')
const fs = require('fs');

app.set('trust proxy', 1) // trust first proxy 

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


  
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())
 
const mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')


const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");


//var ar = [];
//ar = word.split("");
//console.log(ar);
//
var assets = {
    
    word: fetchWord(),
    letter: [],
    guesses: 8,
    display: [],
    message: "",
    result: ""
};


function fetchWord(){
    var word = words[Math.floor(Math.random()*words.length)];
    return word;
    
};
console.log(assets.word);



app.get('/', function(req, res) {
  // console.log("here");
  assets.display = newGame(assets.word, assets.letter);
  // console.log("here");
  if (gameover(res)){
    res.render("end", assets);
  } else {
    res.render("index", assets);
  }
})

app.post("/", function(req,res){
  if (gameover()){
    assets = startNewGame();
    res.redirect("/");
  } else {
    console.log(req.body);
    assets.letter.push(req.body.guess);
    countLetters(req.body.guess);
    res.redirect('/');
  }
})

function fetchWord(){
  let word = words[Math.floor(Math.random()*words.length)];
  return word;
}

  function newGame(word,letters){
  // console.log("here");
  let display= [];
  for (let i=0; i<word.length; i++){
    if(letters.includes(word[i])){
      display.push(word[i]);
    } else {
      display.push("_");
    }
  }
  return display;
}

function countLetters(theWord){
  let splitWord = assets.word.split("");
  if(!splitWord.includes(theWord)) {
    assets.guesses--;
  }

}

function gameover(){
    if (assets.guesses===0){
      assets.message="Sorry! No more guesses available!";
      assets.result="Lose!!!";
      return true;
    }
    else if(!assets.display.includes("_")){
      assets.message="Word found !!!";
      assets.result="Win!!!";
      return true;
    }
    else{
      return false;
    }
}

function startNewGame(){
  let newAssets={
    word: fetchWord(),
    letter:[],
    guesses:8,
    correctGuess:[],
    wrongGuess:[],
    display:[],
    message:"",
    result:""
  };
  return newAssets;
}

app.get("/", function (req,res){
  res.render("index");
})

app.listen(3000, function() {
  console.log("MysteryGame Started...");
  console.log(assets.word);
});