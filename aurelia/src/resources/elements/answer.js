import { bindable, inject, computedFrom } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Auth } from '../../services/auth';
import { DialogService } from 'aurelia-dialog';
import { ConfirmationDialog } from './confirmation-dialog';

var toastr = require('toastr');

@inject(HttpClient, toastr, Auth, DialogService)
export class Answer {
  @bindable content;

  constructor(httpClient, toastr, auth, dialogService) {
    this.httpClient = httpClient;
    this.toastr = toastr;
    this.auth = auth;
    this.dialogService = dialogService;
  }

  delete() {
    this.dialogService.open({ viewModel: ConfirmationDialog, model: { headline: "Delete answer", message: "Are you sure you want to delete this answer?"} })
      .then(response => {
        if(!response.wasCancelled) {
          console.log(response);
          this.httpClient.fetch(`answers/${this.content._id}`, { method: 'delete' })
            .then(() => {
              this.toastr.success('You have successfully deleted your answer');
              this.deleted = true;
            });
        }
      });
  }

  voteUp() {
    this.httpClient.fetch(`answers/votes/${this.content._id}/thumbsup`, { method: 'put'})
      .then(response => response.json())
      .then(voteResp => {
        if(voteResp.vote)
          this.content.positiveVotes += 1;
      });
  }

  voteDown() {
    this.httpClient.fetch(`answers/votes/${this.content._id}/thumbsdown`, { method: 'put'})
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