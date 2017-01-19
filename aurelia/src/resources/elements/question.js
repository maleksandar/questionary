import {bindable, inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Auth} from '../../services/auth';

var toastr = require('toastr');

@inject(HttpClient, toastr, Auth)
export class Question {
  @bindable content;

  constructor(httpClient, toastr, auth) {
    this.httpClient = httpClient;
    this.toastr = toastr;
    this.auth = auth;
  }

  quickAnswer() {
    this.httpClient.fetch('answers', { method: 'post', body: json({ text: this.answerText, QuestionId: this.content._id }) })
      .then(() => {
        this.toastr.success('You have successfully posted your answer');
      });
  }
}