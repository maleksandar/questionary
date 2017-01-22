import {bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class QuestionList {
  @bindable value;

  constructor(httpClient) {
    this.httpClient = httpClient;
    this.pageIndexes = [];
    this.questions = [];
    this.questionsIsNotEmpty = false;
    this.paginationLower = false;
    this.paginationGreater = false;
    this.middlePages = [];

    this.httpClient.fetch('questions?include=Answers&include=Tags&offset=0')
      .then(response => response.json())
      .then(responseObj => {
        if(responseObj.count != 0) {
          this.questions = responseObj.rows;
          this.questionsIsNotEmpty = true;
          this.currentIndex = 0;
          var count = responseObj.count;
          if(count % 3 == 0)
            this.pageIndexes = Array.from(new Array(Math.floor(count/3)), (x,i) => i);
          else
            this.pageIndexes = Array.from(new Array(Math.floor(count/3) + 1), (x,i) => i);
          this.paginationLower = this.questionsIsNotEmpty && (this.pageIndexes.length <= 5);
          this.paginationGreater = this.questionsIsNotEmpty && (this.pageIndexes.length > 5);
          this.middlePages = this.getPages(this.currentIndex);
        }
    });
  }

  valueChanged(newValue, oldValue) {
  }

  setPage(index) {
     this.httpClient.fetch('questions?include=Answers&include=Tags&offset=' + (index*3).toString())
      .then(response => response.json())
      .then(responseObj => {
        this.questions = responseObj.rows;
        this.questionsIsNotEmpty = true;
        var count = responseObj.count;
          if(count % 3 == 0)
            this.pageIndexes = Array.from(new Array(Math.floor(count/3)), (x,i) => i);
          else
            this.pageIndexes = Array.from(new Array(Math.floor(count/3) + 1), (x,i) => i);
        this.paginationLower = this.questionsIsNotEmpty && (this.pageIndexes.length <= 5);
        this.paginationGreater = this.questionsIsNotEmpty && (this.pageIndexes.length > 5);
        this.middlePages = this.getPages(index);
      });
    this.currentIndex = index;
  }

  getPages(index) {
    if(index <= 1)
      return this.pageIndexes.slice(1,4);
    else if(index > 1 && (index <= (this.pageIndexes.length - 3)))
      return this.pageIndexes.slice(index-1, index+2);
    else if(index > 1 && (index > (this.pageIndexes.length - 3)))
      return this.pageIndexes.slice(this.pageIndexes.length - 4, this.pageIndexes.length - 1);
  } 
}

