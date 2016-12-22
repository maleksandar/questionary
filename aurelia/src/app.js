import {inject} from 'aurelia-framework';
import {Auth} from './services/auth';
import {SharedResources} from './config/sharedResources';

@inject(Auth, SharedResources)
export class App {

  configureRouter(config, router){
    config.title = 'Contacts';
    config.map([
      { route: '',              moduleId: 'pages/questions',   title: 'Questions' },
      { route: 'login',  moduleId: 'pages/login', name: 'login', title: 'Log in' },
      { route: 'logout',  moduleId: 'pages/logout', name: 'logout', title: 'Log out' },
      { route: 'signup', moduleId: 'pages/signup', name: 'signup', title: 'Sign up' }
    ]);
    this.router = router;
  }
  constructor(auth, sharedResources) {
    this.auth = auth;
    this.navbarElements = [
      { title: 'Home', href: '#', icon: 'fa fa-home' },
      { title: 'Questions', href: '#' },
      { title: 'About', href: '#' }
      // { title: 'Sign Up', href: '#/signup' },
      // { title: 'Log In', href: '#/login '}
    ];
    this.currentUser = sharedResources.currentUser;
  }
}
