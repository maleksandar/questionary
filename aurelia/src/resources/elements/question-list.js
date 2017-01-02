import {bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class QuestionList {
  @bindable value;

  constructor(httpClient) {
    this.currentUser = { isDefined: false };
    this.httpClient = httpClient;

    this.httpClient.fetch('questions')
      .then(response => response.json())
      .then(questions => this.questions = questions);

    this.httpClient.fetch('users/me')
      .then(response => response.json())
      .then(user => {
        this.currentUser.id = user._id;
        this.currentUser.name = user.name;
        this.currentUser.isDefined = true;
      });
  }

  valueChanged(newValue, oldValue) {

  }
}

