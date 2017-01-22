import { bindable, inject, computedFrom } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Auth } from '../../services/auth';
import { DialogService } from 'aurelia-dialog';
import { ConfirmationDialog } from './confirmation-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';

var toastr = require('toastr');

@inject(HttpClient, toastr, Auth, DialogService, EventAggregator)
export class Question {
  @bindable content;

  constructor(httpClient, toastr, auth, dialogService, ea) {
    this.httpClient = httpClient;
    this.toastr = toastr;
    this.auth = auth;
    this.dialogService = dialogService;
    this.ea = ea;
  }

  quickAnswer() {
    this.httpClient.fetch('answers', { method: 'post', body: json({ text: this.answerText, QuestionId: this.content._id }) })
      .then(() => {
        this.answerText = "";
        this.content.Answers.push({}); // to incrase the counter;
        this.ea.publish('questionAnswered', { id: this.content._id  });
        this.toastr.success('You have successfully posted your answer');
      });
  }

  delete() {
    this.dialogService.open({ viewModel: ConfirmationDialog, model: { headline: "Delete question", message: "Are you sure you want to delete this question?"} })
      .then(response => {
        if(!response.wasCancelled) {
          console.log(response);
          this.httpClient.fetch(`questions/${this.content._id}`, { method: 'delete' })
            .then(() => {
              this.toastr.success('You have successfully deleted your question');
              this.deleted = true;
            });
        }
      });
  }

  pin() {
    this.pinned = !this.pinned;
  }
  
  @computedFrom('auth.currentUser.userId', 'content.createdByUserId')
  get authorized() {
    return parseInt(this.auth.currentUser.userId) === parseInt(this.content.createdByUserId);
  }

  @computedFrom('auth.isLogedIn')
  get authenticated() {
    return this.auth.isLogedIn;
  }
}