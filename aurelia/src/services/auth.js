import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';


@inject(HttpClient, Router)
export class Auth {
  constructor(httpClient, router) {
    this.httpClient = httpClient;
    this.router = router;
    this.isLogedIn = sessionStorage.getItem("logedIn") === "true";
    this.currentUser = { userId: sessionStorage.getItem("userId"), role: sessionStorage.getItem("role") }
    console.log('auth constructor', this.currentUser);
  }

  login(email, password) {
    return this.httpClient.fetch('auth/login', {
      method: 'post',
      body: json({ email: email, password: password })
    })
    .then(response => response.json())
    .then(userinfo => {
      console.log(userinfo);
      // sessionStorage can only save strings not bools.
      sessionStorage.setItem('logedIn', "true");
      this.isLogedIn = true;
      this.currentUser.userId = userinfo.user_id;
      sessionStorage.setItem('userId', userinfo.user_id);
      return userinfo;
    });
  }

  logout() {
    sessionStorage.setItem('logedIn', "false");
    this.isLogedIn = false;
    this.currentUser.userId = "";
    sessionStorage.setItem('userId', "");
    return this.httpClient.fetch('auth/logout', {
      method: 'post'
    }).then(() => {
      this.router.navigate("");
    });
  }
}