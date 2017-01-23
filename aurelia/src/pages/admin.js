import {Auth} from '../services/auth';
import {inject} from 'aurelia-framework';

@inject(Auth)
export class Admin {
  constructor(auth) {
    this.auth = auth;
  }
  canActivate() {
    return this.auth.currentUser.role === 'admin';
  }
}