import {bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class QuestionList {
  @bindable value;

  constructor(httpClient) {
    this.httpClient = httpClient;

    this.httpClient.fetch('questions')
      .then(response => response.json())
      .then(questions => this.questions = questions);
  }

  valueChanged(newValue, oldValue) {

  }
}

