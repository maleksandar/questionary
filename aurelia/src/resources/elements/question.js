import {bindable, inject, computedFrom } from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Auth} from '../../services/auth';
import {DialogService} from 'aurelia-dialog';

var toastr = require('toastr');

@inject(HttpClient, toastr, Auth, DialogService)
export class Question {
  @bindable content;

  constructor(httpClient, toastr, auth, dialogService) {
    this.httpClient = httpClient;
    this.toastr = toastr;
    this.auth = auth;
    this.dialogService = dialogService;
  }

  quickAnswer() {
    this.httpClient.fetch('answers', { method: 'post', body: json({ text: this.answerText, QuestionId: this.content._id }) })
      .then(() => {
        this.toastr.success('You have successfully posted your answer');
      });
  }
  
  @computedFrom('auth.currentUser.userId', 'content.createdByUserId')
  get authorized() {
    return parseInt(this.auth.currentUser.userId) === parseInt(this.content.createdByUserId);
  }

  @computedFrom('auth.isLogedIn')
  get authenticated() {
    return this.auth.isLogedIn;
  }

  deleteQuestion(question) {
    // this.dialogService.open({viewModel: }); //Are you sure (confirm)
  }
}