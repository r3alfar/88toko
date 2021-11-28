// // import * as sw from 'stopword';
// const sastrawi = require("sastrawijs");
// const sw = require("stopword");

// var sentence =
//     "Perekonomian Indonesia sedang dalam pertumbuhan yang membanggakan";

// var sec_sentence = "Rancang Bangun SIstem Pakar berbasis web untuk Mendiagnosa Penyakit pada sapi Perah";
// var gather = sentence + " " + sec_sentence;
// var stemmed = [];
// var stemmer = new sastrawi.Stemmer();
// var tokenizer = new sastrawi.Tokenizer();
// var words = tokenizer.tokenize(gather);
// //var word = [];
// for (let word of words) {
//     stemmed.push(stemmer.stem(word));
// }
// const sw_sentence = sw.removeStopwords(stemmed, sw.id);

// //console.log(words.length);
// // console.log("main sentence", sentence);
// // console.log("tokenize", words);
// // console.log("stemming", stemmed);
// // console.log("stopword removal", sw_sentence);
// console.log(sw_sentence);
// console.log(sw_sentence[1]);



//NATURAL --------------------------------------------------------------------------------
// import { TfIdf } from "natural";

// let tfidf = new TfIdf();

//tfidf = new TfIdf();
const tfidff = require('natural/lib/natural/tfidf'),
    TfIdff = tfidff.TfIdf,
    tfidf = new TfIdff();

// const natural = require('natural'),
//     TfIdf = natural.TfIdf,
//     tfidf = new TfIdf();

tfidf.addDocument('i code in c.');
tfidf.addDocument('i code in ruby.');
tfidf.addDocument('i code in ruby and node, but node more often.');
tfidf.addDocument('this document is about natural, written in node');
tfidf.addDocument('i code in fortran.');

console.log('node --------------------------------');
tfidf.tfidfs('node', function (i, measure) {
    console.log('document #' + i + ' is ' + measure);
});

console.log('ruby --------------------------------');
tfidf.tfidfs('ruby', function (i, measure) {
    console.log('document #' + i + ' is ' + measure);
});