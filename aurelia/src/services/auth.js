import {bindable, inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';

@inject(HttpClient)
export class Auth {
  constructor(httpClient) {
    this.httpClient = httpClient;
    this.isLogedIn = false;
  }

  login(email, password) {
    return this.httpClient.fetch('auth/login', {
      method: 'post',
      body: json({ email: email, password: password })
    })
      .then(response => {
        this.isLogedIn = true;
        return response.json();
      });
      
  }

  logout() {
    return this.httpClient.fetch('auth/logout', {
      method: 'post'
    }).then(response => { this.isLogedIn = false })
  }
}