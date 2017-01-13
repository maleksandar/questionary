import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';

@inject(HttpClient)
export class Auth {
  constructor(httpClient) {
    this.httpClient = httpClient;
    this.isLogedIn = sessionStorage.getItem("logedIn") === "true" ? true : false;
  }

  login(email, password) {
    return this.httpClient.fetch('auth/login', {
      method: 'post',
      body: json({ email: email, password: password })
    })
    .then(response => {
      // sessionStorage can only save strings not bools.
      sessionStorage.setItem('logedIn', "true");
      this.isLogedIn = true;
      return response.json();
    });
  }

  logout() {
    sessionStorage.setItem('logedIn', "false");
    this.isLogedIn = false;
    return this.httpClient.fetch('auth/logout', {
      method: 'post'
    });
  }
}