import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';


@inject(HttpClient)
export class QuestionDetails {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    var questionPromise = this.httpClient.fetch(`questions/${params.id}?include=Tags&include=Answers`)
      .then(questionDetail => questionDetail.json())
      .then(question => { 
        this.questionContent = question; 
        this.routeConfig.navModel.setTitle(question.headline);
      console.log(question);
      });

    var answerPromise = this.httpClient.fetch(`answers/question/${params.id}`)
      .then(response => response.json())
      .then(answers => { 
        this.answers = answers; 
      console.log(answers);
        
      });

    return Promise.all([questionPromise, answerPromise]);
  }
}