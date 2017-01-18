import {bindable, inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
var toastr = require('toastr');

@inject(HttpClient, toastr)
export class Question {
  @bindable content;

  constructor(httpClient, toastr) {
    this.httpClient = httpClient;
    this.toastr = toastr;
  }

  quickAnswer() {
    this.httpClient.fetch('answers', { method: 'post', body: json({ text: this.answerText, QuestionId: this.content._id }) })
      .then(() => {
              this.toastr.success('You have successfully posted your question');

      });
  }
}