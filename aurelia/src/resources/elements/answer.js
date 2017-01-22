import { bindable, inject, computedFrom } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Auth } from '../../services/auth';

@inject(HttpClient, Auth)
export class Answer {
  @bindable content;

  constructor(httpClient, auth) {
    this.httpClient = httpClient;
    this.auth = auth;
  }

  voteUp() {
    this.httpClient.fetch('answers/votes/' + this.content._id.toString() + '/thumbsup', { method: 'put'});
  }

  voteDown() {
    this.httpClient.fetch('answers/votes/' + this.content._id.toString() + '/thumbsdown', { method: 'put'});
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