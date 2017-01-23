import {Auth} from '../services/auth';
import {inject} from 'aurelia-framework';

@inject(Auth)
export class Home {
  constructor(auth) {
    this.auth = auth;
    this.sideForm = 'filter';
  }

  canActivate() {
    return this.auth.isLogedIn;
  }
    showFilter() {
    if(this.sideForm === 'filter') {
      this.sideForm = null
    } else {
      this.sideForm = 'filter';
    }  }

  showForm() {
    if(this.sideForm === 'form') {
      this.sideForm = null
    } else {
      this.sideForm = 'form';
    }
  }
}