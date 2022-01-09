import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Produk } from '../models/produk.model';
const sastrawi = require('sastrawijs');
var stemmer = new sastrawi.Stemmer();
var tokenizer = new sastrawi.Tokenizer();
import * as sw from 'stopword';

@Injectable({
  providedIn: 'root'
})
export class RekomendasiService {
  query: any;
  products: Produk[];
  corpuses: any[];
  termsAll: any[];
  terms: any[];
  tfidf_score: any[];
  rankedProduct: any[];
  unsortedRank: any[];

  searchQuery: any[];
  searchResult: any[];
  constructor() { }


  // getRecommendation(documents: Produk[], queryId: string) {
  //   this.getCorpusOfDocument(documents);
  //   this.getTerms();
  //   this.getTFIDFscore();
  //   this.getCosineSimilarity(queryId);
  // }

  getSearchResults(documents: Produk[], query: string) {
    this.getCorpusOfDocument(documents, query);
    this.getTerms();
    this.getTFIDFbyKeyword();

    for (let i = 0; i < documents.length; i++) {
      documents[i].nilaiSearchbyKeyword = this.searchResult[i];
    }

    documents.sort(function (a, b) {
      return b.nilaiSearchbyKeyword - a.nilaiSearchbyKeyword;
    });

    return documents;
  }


  getRecommendation(documents: Produk[], queryId: string) {
    this.getCorpusOfDocument(documents);
    this.getTerms();
    this.getTFIDFscore();
    this.getCosineSimilarity(queryId);

    console.log(this.unsortedRank);
    for (var i = 0; i < documents.length; i++) {
      documents[i].nilairekomendasi = this.unsortedRank[i].value;
    }

    documents.sort(function (a, b) {
      return b.nilairekomendasi - a.nilairekomendasi;
    });

    //console.log(documents);
    return documents;
  }

  // getCorpusOfDocumentSearch(documents: Produk[], query?: string) {
  //   var corpus = [];

  //   for (var i = 0; i < documents.length; i++) {
  //     var bow = documents[i].nama;
  //     var docTokenized = tokenizer.tokenize(bow);
  //     var docStemmed = [];
  //     for (let docToken of docTokenized) {
  //       docStemmed.push(stemmer.stem(docToken));
  //     }
  //     var docStopword = sw.removeStopwords(docStemmed, sw.id);
  //     corpus.push(docStopword.sort());

  //   }

  //   if (query) {
  //     const keyTokenized = tokenizer.tokenize(query);
  //     const keyStemmed = [];
  //     for (let keyToken of keyTokenized) {
  //       keyStemmed.push(stemmer.stem(keyToken));
  //     }
  //     var keyStopword = sw.removeStopwords(keyStemmed, sw.id);
  //     //corpus.unshift(keyStopword.sort());
  //     this.searchQuery = keyStopword;
  //   }
  //   this.corpuses = corpus;
  //   console.log(this.corpuses);
  //   console.log("keyowrd after processing: ", this.searchQuery);
  // }

  getCorpusOfDocument(documents: Produk[], query?: string) {
    var corpus = [];

    for (var i = 0; i < documents.length; i++) {
      var bow = documents[i].nama + " " + documents[i].desc;
      var docTokenized = tokenizer.tokenize(bow);
      var docStemmed = [];
      for (let docToken of docTokenized) {
        docStemmed.push(stemmer.stem(docToken));
      }
      var docStopword = sw.removeStopwords(docStemmed, sw.id);
      corpus.push(docStopword.sort());

    }

    if (query) {
      const keyTokenized = tokenizer.tokenize(query);
      const keyStemmed = [];
      for (let keyToken of keyTokenized) {
        keyStemmed.push(stemmer.stem(keyToken));
      }
      var keyStopword = sw.removeStopwords(keyStemmed, sw.id);
      //corpus.unshift(keyStopword.sort());
      this.searchQuery = keyStopword;
    }
    this.corpuses = corpus;
    console.log(this.corpuses);
    console.log("keyowrd after processing: ", this.searchQuery);
  }

  getTerms() {
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    }

    //ALL TERMS
    var allwords = [];
    for (var i = 0; i < this.corpuses.length; i++) {
      allwords.push(...this.corpuses[i]);
    }
    this.termsAll = allwords;

    //UNIQUE TERMS
    this.terms = allwords.filter(unique).sort();
    console.log(this.terms);
  }

  getTFIDFbyKeyword() {
    const keywordTFDF = {};

    //term Frequency globally (total of term found in documents)
    for (let i = 0; i < this.searchQuery.length; i++) {
      const kata = this.searchQuery[i];
      for (let j = 0; j < this.termsAll.length; j++) {
        const carikata = this.termsAll[j];
        if (keywordTFDF[kata] === undefined && kata === carikata) {
          keywordTFDF[kata] = {
            tf: 1,
            df: 0,
            idf: 0
          };
        }
        else if (keywordTFDF[kata] && kata === carikata) {
          keywordTFDF[kata].tf++
        }
        //jika kata tidak ditemukan sama sekali
        else if (keywordTFDF[kata] === undefined && kata !== carikata) {
          keywordTFDF[kata] = {
            tf: 0,
            df: 0,
            idf: 0
          };
        }
      }
    }

    //df documentFrequency globally (how many documents containing term)
    for (var i = 0; i < this.searchQuery.length; i++) {
      const kata = this.searchQuery[i];
      for (var j = 0; j < this.corpuses.length; j++) {
        for (var k = 0; k < this.corpuses[j].length; k++) {
          if (kata === this.corpuses[j][k]) {
            keywordTFDF[kata].df++;
            break;
          }
        }
      }
    }

    //tf per document (total of term found in a document)
    const docTF = [];
    for (var i = 0; i < this.corpuses.length; i++) {
      docTF[i] = {};
      for (var j = 0; j < this.searchQuery.length; j++) {
        const termword = this.searchQuery[j];
        for (var k = 0; k < this.corpuses[i].length; k++) {
          if (docTF[i][termword] === undefined) {
            docTF[i][termword] = 0;
          }
          if (termword === this.corpuses[i][k]) {
            docTF[i][termword] += 1;
          }
        }
      }
    }

    //idf calculation inverse document frequency (totalDocument/how many document containing term)
    for (let i = 0; i < this.searchQuery.length; i++) {
      var idfWord = this.searchQuery[i];

      if (keywordTFDF[idfWord].df === 0) {
        //mencegah pembagian 0
        keywordTFDF[idfWord].idf = 0;
      }
      else {
        keywordTFDF[idfWord].idf = Math.log10(this.corpuses.length / keywordTFDF[idfWord].df);
      }

    }

    console.log(keywordTFDF);
    console.log(docTF);

    //vector of TFIDF, Normalisasikan TF lalu kalikan dengan idf
    const docsTFIDF = [];
    for (var i = 0; i < this.corpuses.length; i++) {
      docsTFIDF[i] = [];
      for (var j = 0; j < this.searchQuery.length; j++) {
        docsTFIDF[i][j] = (docTF[i][this.searchQuery[j]] / this.corpuses[i].length) * keywordTFDF[this.searchQuery[j]].idf;
      }
    }

    console.log(docsTFIDF);

    const sumTFIDF = [];
    for (let i = 0; i < docsTFIDF.length; i++) {
      sumTFIDF[i] = 0;
      for (let j = 0; j < docsTFIDF[i].length; j++) {
        sumTFIDF[i] += docsTFIDF[i][j];
      }
    }

    console.log(sumTFIDF);
    this.searchResult = sumTFIDF;
  }

  getTFIDFscore() {

    // const corpus = this.corpuses;
    var termTFDF = {};

    //Global Term Frequency
    for (var i = 0; i < this.termsAll.length; i++) {
      var kata = this.termsAll[i];
      if (termTFDF[kata] === undefined) {
        termTFDF[kata] = {
          tf: 1,
          df: 0,
          idf: 0
        };
      }
      else termTFDF[kata].tf++;
    }

    //document Frequency
    for (var i = 0; i < this.terms.length; i++) {
      const kata = this.terms[i];
      for (var j = 0; j < this.corpuses.length; j++) {
        for (var k = 0; k < this.corpuses[j].length; k++) {
          if (kata === this.corpuses[j][k]) {
            termTFDF[kata].df++;
            break;
          }
        }
      }
    }

    //Term Frequency perDocument
    var docTF = [];
    for (var i = 0; i < this.corpuses.length; i++) {
      docTF[i] = {};
      for (var j = 0; j < this.terms.length; j++) {
        var termword = this.terms[j];
        for (var k = 0; k < this.corpuses[i].length; k++) {
          if (docTF[i][termword] === undefined) {
            docTF[i][termword] = 0;
          }
          if (termword === this.corpuses[i][k]) {
            docTF[i][termword] += 1;
          }
        }
      }
    }


    //lanjut idf
    for (var i = 0; i < this.terms.length; i++) {
      var idfWord = this.terms[i];
      termTFDF[idfWord].idf = Math.log10(this.corpuses.length / termTFDF[idfWord].df);
    }


    //calculate TFIDF for each document
    var docsTFIDF = [];
    for (var i = 0; i < this.corpuses.length; i++) {
      docsTFIDF[i] = [];
      for (var j = 0; j < this.terms.length; j++) {
        docsTFIDF[i][j] = (docTF[i][this.terms[j]] / this.corpuses[i].length) * termTFDF[this.terms[j]].idf;
      }
    }

    this.tfidf_score = docsTFIDF;

    console.log(docTF);
    console.log(termTFDF);
    console.log(docsTFIDF);
    console.log(this.tfidf_score);

  }


  calcCosineSimilarity(Q: number[], B: number[]) {
    let dotproduct: number = 0;
    var mA = 0;
    var mB = 0;

    for (var i = 0; i < Q.length; i++) {
      dotproduct += Q[i] * B[i];
      mA += (Q[i] * Q[i]);
      mB += (B[i] * B[i]);
    }

    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = (dotproduct) / ((mA) * (mB));
    return similarity;
  }

  getCosineSimilarity(queryId: string) {
    //split actual id to index. prd0001 to 1
    const idIdx = parseInt(queryId.substring(3));

    //cosine. produkId-1
    const cosimScore = [];
    for (let i = 0; i < this.tfidf_score.length; i++) {
      let resInfo = {
        id: i,
        value: this.calcCosineSimilarity(this.tfidf_score[idIdx - 1], this.tfidf_score[i])
      };
      cosimScore.push(resInfo);
    }

    //Rank by value
    console.log(cosimScore);
    const rankedSimilarity = cosimScore;
    this.unsortedRank = cosimScore;
    // rankedSimilarity.sort(function (a, b) {
    //   return a.value - b.value;
    // }).reverse();
    // console.log(rankedSimilarity);

    //ProductID based on ranked value (array of rankedId)
    var rankedIds = [];
    for (var i = 0; i < rankedSimilarity.length; i++) {

      var tempidx = "";
      //getIdIdx length
      var id_length = rankedSimilarity[i].id.toString().length;
      // console.log(rankedSimilarity[0].id.toString().length);
      for (var j = id_length; j < 4; j++) {
        tempidx += "0";
      }

      //concat fixedid
      rankedIds[i] = "prd" + tempidx + (rankedSimilarity[i].id + 1);
    }

    console.log(rankedIds);
    this.rankedProduct = rankedIds;
  }

  // getProductRecommendation(key: string[]): AngularFireList<Produk>{
  //   return this.dbsource.list(`products/${key}`);
  // }
}
