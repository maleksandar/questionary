import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {SharedResources} from '../config/sharedResources';
import {Auth} from '../services/auth';

@inject(Router, Auth, SharedResources)
export class Logout {
  constructor(router, auth, sharedResources) {
    this.auth = auth;
    this.router = router;
    this.sharedResources = sharedResources;

    this.auth.logout()
      .then(() => { 
        this.router.navigate("");
        this.sharedResources.isLogedIn = false;
        this.sharedResources.isAdmin = false;
        this.sharedResources.id = -1;
        this.sharedResources.name = "";
        this.sharedResources.email = "";
        this.sharedResources.role = "";
      });
  }
}