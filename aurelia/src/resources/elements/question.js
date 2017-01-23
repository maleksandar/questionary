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

  attached() {
    this.httpClient.fetch(`pins/question/${this.content._id}`)
      .then(response => response.json())
      .then(pinned => { this.pinned = pinned; } )
      .catch(reson => console.log(reason));
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
    if(!this.pinned)
      this.httpClient.fetch(`pins/question/${this.content._id}`, { method: 'post' });
    if(this.pinned)
      this.httpClient.fetch(`pins/question/${this.content._id}`, { method: 'delete' });
    this.pinned = !this.pinned;
  }

  voteUp() {
    this.httpClient.fetch(`questions/votes/${this.content._id}/thumbsup`, { method: 'put'})
      .then(response => response.json())
      .then(voteResp => {
        if(voteResp.vote)
          this.content.positiveVotes += 1;
      });
  }

  voteDown() {
    this.httpClient.fetch(`questions/votes/${this.content._id}/thumbsdown`, { method: 'put'})
      .then(response => response.json())
      .then(voteResp => {
        if(voteResp.vote)
          this.content.negativeVotes += 1;
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
}