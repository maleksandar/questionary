import {bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {SharedResources} from '../../config/sharedResources';

@inject(HttpClient, SharedResources)
export class QuestionList {
  @bindable value;

  constructor(httpClient, sharedResources) {
    this.httpClient = httpClient;
    this.sharedResources = sharedResources;

    this.httpClient.fetch('questions')
      .then(response => response.json())
      .then(questions => this.questions = questions);
  }

  valueChanged(newValue, oldValue) {

  }
}

