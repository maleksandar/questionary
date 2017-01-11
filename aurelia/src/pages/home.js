import {Auth} from '../services/auth';
import {inject} from 'aurelia-framework';
import {SharedResources} from '../config/sharedResources';

@inject(Auth, SharedResources)
export class Home {
  constructor(auth, sharedResources) {
    this.auth = auth;
    this.sharedResources = sharedResources;
  }

  canActivate() {
    return this.auth.isLogedIn;
  }
}