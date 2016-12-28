import {Auth} from './services/auth';
import {inject} from 'aurelia-framework';

@inject(Auth)
export class App {
  constructor(auth) {
    this.auth = auth;
  }

  configureRouter(config, router){
    config.title = 'Questionary';
    config.map([
      { route: '',              moduleId: 'pages/questions',   title: 'Questions' },
      { route: 'home',              moduleId: 'pages/home',   title: 'Home', nav: false },
      { route: 'login',  moduleId: 'pages/login', name: 'login', title: 'Log in' },
      { route: 'logout',  moduleId: 'pages/logout', name: 'logout', title: 'Log out' },
      { route: 'signup', moduleId: 'pages/signup', name: 'signup', title: 'Sign up' }
    ]);
    this.router = router;
  }
}
