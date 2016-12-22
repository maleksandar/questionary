import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Auth} from '../services/auth';

@inject(Auth, Router)
export class Login {
  constructor(auth, router) {
    this.auth = auth;
    this.router = router;
  }

  login() {
    this.auth.login(this.email, this.password)
      .then(() => {
        this.router.navigate("");
      })
      .catch(() => this.loginError = true);
  }
}