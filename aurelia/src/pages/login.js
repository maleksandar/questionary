import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {HttpClient} from 'aurelia-fetch-client';
import {SharedResources} from '../config/sharedResources';
import {Auth} from '../services/auth';

@inject(Auth, Router, HttpClient, SharedResources)
export class Login {
  constructor(auth, router, httpClient, sharedResources) {
    this.auth = auth;
    this.router = router;
    this.httpClient = httpClient;
    this.sharedResources = sharedResources;
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
            .then(response => response.json())
            .then(user => {
              this.sharedResources.isLogedIn = true;
              this.sharedResources.isAdmin = user.role == "admin";
              this.sharedResources.id = user._id;
              this.sharedResources.name = user.name;
              this.sharedResources.email = user.email;
            });
        } 
      });
  }
}