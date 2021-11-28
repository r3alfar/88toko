var sastrawi = require('sastrawijs');

var d1 = "Perekonomian Indonesia sedang dalam pertumbuhan yang membanggakan";

var tokenizer = new sastrawi.Tokenizer();

var t1_d1 = tokenizer.tokenize(d1.toLowerCase());

alert("pop up");
// document.getElementById('t1_d1').innerHTML = t1_d1;
document.getElementById('t1_d1') = d1;