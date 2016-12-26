import {Auth} from '../services/auth';
import {inject} from 'aurelia-framework';

@inject(Auth)
export class Home {
  constructor(auth) {
    this.auth = auth;
  }

  canActivate() {
    return this.auth.isLogedIn;
  }
}