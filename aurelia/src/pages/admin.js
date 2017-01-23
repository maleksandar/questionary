import { Auth } from '../services/auth';
import { inject, computedFrom } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { DialogService } from 'aurelia-dialog';
import { ConfirmationDialog } from '../resources/elements/confirmation-dialog';

@inject(Auth, HttpClient, DialogService)
export class Admin {
  constructor(auth, httpClient, dialogService) {
    this.auth = auth;
    this.httpClient = httpClient;
    this.dialogService = dialogService;
    this.domains = [];
    this.users = [];
  }

  attached() {
    this.httpClient.fetch(`domains`).then(response => response.json()).then(domains => { this.domains = domains; });
    this.httpClient.fetch('users').then(response => response.json()).then(users => { this.users = users; });
  }

  canActivate() {
    return this.auth.currentUser.role === 'admin';
  }

  addDomain() {
    this.httpClient.fetch(`domains`, { method: 'post', body: json({ text: this.domain }) })
      .then(() => {
        this.httpClient.fetch(`domains`).then(response => response.json())
        .then(domains => { this.domains = domains; this.domain = ""; });
      });
  }

  deleteDomain(dom) {
    this.dialogService.open({ viewModel: ConfirmationDialog, model: { headline: "Delete domain", message: "Are you sure you want to delete this domain?" } })
      .then(response => {
        if (!response.wasCancelled) {
          this.httpClient.fetch(`domains/${dom.text}`, { method: 'delete' })
            .then(() => {
              this.httpClient.fetch(`domains`).then(response => response.json()).then(domains => { this.domains = domains; });
            });
        }
      });
  }

  deleteUser(u) {
    this.dialogService.open({ viewModel: ConfirmationDialog, model: { headline: "Delete user", message: "Are you sure you want to delete this user?" } })
      .then(response => {
        if (!response.wasCancelled) {
          this.httpClient.fetch(`users/${u._id}`, { method: 'delete' })
            .then(() => {
              this.httpClient.fetch(`users`).then(response => response.json()).then(users => { this.users = users; });
            });
        }
      });
  }

  @computedFrom('auth.currentUser.role')
  get isAdmin() {
    return this.auth.currentUser.role === 'admin';
  }
}