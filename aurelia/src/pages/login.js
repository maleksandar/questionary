import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {HttpClient} from 'aurelia-fetch-client';
import {Auth} from '../services/auth';

@inject(Auth, Router, HttpClient)
export class Login {
  constructor(auth, router, httpClient) {
    this.auth = auth;
    this.router = router;
    this.httpClient = httpClient;
  }

  login() {
    this.auth.login(this.email, this.password)
      .then(() => {
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