import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {HttpClient} from 'aurelia-fetch-client';
import {Auth} from '../services/auth';
import {DialogController} from 'aurelia-dialog';

@inject(Auth, Router, HttpClient, DialogController)
export class Login {
  constructor(auth, router, httpClient, dialogController) {
    this.auth = auth;
    this.router = router;
    this.httpClient = httpClient;
    this.dialogController = dialogController;
  }

  login() {
    this.auth.login(this.email, this.password)
      .then(() => {
        this.dialogController.close();
        this.router.navigate("");
      })
      .catch(() => this.loginError = true)
      .then(() => {
        if(!this.loginError) {
          this.httpClient.fetch('users/me')
            .then(response => response.json());
        }
      });
  }
}