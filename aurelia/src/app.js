import { Auth } from './services/auth';
import { inject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Login } from './dialogs/login';
import { Signup } from './dialogs/signup';


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
      { route: 'question/:id', moduleId: 'pages/question-details', name: 'question-details', title: 'Question' },
    ]);
    this.router = router;
  }

  loginModal() {
    this.dialogService.open({ viewModel: Login });
  }

  signupModal() {
    this.dialogService.open({ viewModel: Signup });
  }
}
