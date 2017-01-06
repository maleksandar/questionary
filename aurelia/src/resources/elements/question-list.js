import {bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {SharedResources} from '../../config/sharedResources';

@inject(HttpClient, SharedResources)
export class QuestionList {
  @bindable value;

  constructor(httpClient, sharedResources) {
    this.httpClient = httpClient;
    this.sharedResources = sharedResources;
    this.qss = [];
    this.pageIndexes = [];
    sharedResources.currentIndex = -1;
    this.qssIsNotEmpty = false;

    this.httpClient.fetch('questions')
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

  valueChanged(newValue, oldValue) {
    this.questions = this.qss[newValue];
  }

  setPage(index) {
    this.currentIndex = index;
  }
}

