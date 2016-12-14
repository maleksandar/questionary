import {bindable} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';

let client = new HttpClient();
export class Question {
  @bindable value;

  constructor() {
    this.questions = [];
    client.get('http://localhost:3000/api/questions')
    .then(questions => {
      console.log('response: ', questions.response);
      this.questions = JSON.parse(questions.response);    
    });  
  }

  valueChanged(newValue, oldValue) {

  }
}

