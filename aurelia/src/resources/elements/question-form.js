import {HttpClient, json} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
var toastr = require('toastr');


@inject(HttpClient, Router, toastr)
export class QuestionForm {
  constructor(httpClient, router, toastr) {
    this.httpClient = httpClient;
    this.router = router;
    this.toastr = toastr;
  }

  postQuestion() {
    return this.httpClient.fetch('questions', {
      method: 'post',
      body: json({ headline: this.headline, text: this.text })
    })
    .then(() => {
      this.toastr.success('You have successfully posted your question');
      this.router.navigate("");
    })
    .catch(() => this.serverError = true);
  }
}