import { bindable, inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

@inject(HttpClient)
export class QuestionList {
  @bindable source;

  constructor(httpClient) {
    this.httpClient = httpClient;
    this.qss = [];
    this.pageIndexes = [];
    this.qssIsNotEmpty = false;
  }

  attached() {
    let request = '';
    if(this.source === 'pinned') {
      request = 'questions/pinned';
    } else if(this.source === 'mine') {
      request = 'questions/mine';
    } else {
      request = 'questions?include=Answers&include=Tags'
    }
    console.log('QS: ',this.source);
    this.httpClient.fetch(request)
      .then(response => response.json())
      .then(questions => {
        this.questions = questions;
        while(this.questions.length != 0)
          this.qss.push(this.questions.splice(0,6));
        this.qssIsNotEmpty = this.qss.length != 0;
        if(this.qssIsNotEmpty) {
          this.questions = this.qss[0];
          this.currentIndex = 0;
          this.pageIndexes = Array.from(new Array(this.qss.length), (x,i) => i);
        }
    });
  }

  // valueChanged(newValue, oldValue) {
  //   this.questions = this.qss[newValue];
  // }

  // setPage(index) {
  //   this.currentIndex = index;
  // }
}

