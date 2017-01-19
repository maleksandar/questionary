import {Auth} from './services/auth';
import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Login} from './pages/login';

@inject(Auth, DialogService)
export class App {
  constructor(auth, dialogService) {
    this.auth = auth;
    this.dialogService = dialogService;
  }

  configureRouter(config, router){
    config.title = 'Questionary';
    config.map([
      { route: '',       moduleId: 'pages/questions', title: 'Questions' },
      { route: 'home',   moduleId: 'pages/home',      title: 'Home', nav: false },
      { route: 'login',  moduleId: 'pages/login',     name: 'login', title: 'Log in' },
      { route: 'logout', moduleId: 'pages/logout',    name: 'logout', title: 'Log out' },
      { route: 'signup', moduleId: 'pages/signup',    name: 'signup', title: 'Sign up' },
      { route: 'question/:id', moduleId: 'pages/question-details', name: 'question-details', title: 'Question' },
    ]);
    this.router = router;
  }

  loginModal() {
    this.dialogService.open({viewModel: Login, model: 'Are you sure?' })
    .then(response => {
      console.log(response);
      if (!response.wasCancelled) {
        console.log('OK');
      } else {
        console.log('cancelled');
      }
      console.log(response.output);
      });
  }
}
