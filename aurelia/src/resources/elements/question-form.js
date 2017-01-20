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
    this.tags = [];
    this.tag = "";
  }

  postQuestion() {
    var tagObjects = this.tags.map(tag => { return { text: tag }; })
    return this.httpClient.fetch('questions', {
      method: 'post',
      body: json({ headline: this.headline, text: this.text, Tags: tagObjects })
    })
    .then(() => {
      this.toastr.success('You have successfully posted your question');
      this.router.navigate("");
    })
    .catch(() => this.serverError = true);
  }

  removeTag(tagText) {
    var index = this.tags.indexOf(tagText);
    if (index > -1) {
        this.tags.splice(index, 1);
    }
  }

  addTag() {
    this.tags.push(this.tag);
    this.tag = "";
  }
}