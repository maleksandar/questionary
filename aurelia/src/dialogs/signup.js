import {bindable, inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import {DialogController} from 'aurelia-dialog';


@inject(HttpClient, Router, DialogController)
export class Signup {
  constructor(httpClient, router, dialogController) {
    this.httpClient = httpClient;
    this.router = router;
    this.dialogController = dialogController;
  }

  signup() {
    this.httpClient.fetch('users', {
      method: 'post',
      body: json({ name: this.name, email: this.email, password: this.password })
    }).then(() => {
      this.dialogController.close();
      this.router.navigate("");
    });
  }
}