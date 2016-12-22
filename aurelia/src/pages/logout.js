import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Auth} from '../services/auth';

@inject(Router, Auth)
export class Logout {
  constructor(router, auth) {
    this.auth = auth;
    this.router = router;

    this.auth.logout()
      .then(() => this.router.navigate(""));
  }
}