import { Auth } from '../services/auth';
import { inject, computedFrom } from 'aurelia-framework';

@inject(Auth)
export class Questions {
  constructor(auth) {
    this.auth = auth;
    this.sideForm = null;
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

  @computedFrom('auth.isLogedIn')
  get authenticated() {
    return this.auth.isLogedIn;
  }
}