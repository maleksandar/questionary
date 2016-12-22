import {bindable, inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';

@inject(HttpClient, Router)
export class Signup {
  constructor(httpClient, router) {
    this.httpClient = httpClient;
    this.router = router;
  }

  signup() {
    this.httpClient.fetch('users', {
      method: 'post',
      body: json({ name: this.name, email: this.email, password: this.password })
    }).then(() => this.router.navigate(""));
  }
}