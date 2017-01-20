import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(HttpClient, EventAggregator)
export class QuestionDetails {
  constructor(httpClient, ea) {
    this.httpClient = httpClient;
    this.ea = ea;
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;  

    var questionPromise = this.httpClient.fetch(`questions/${params.id}?include=Tags&include=Answers`)
      .then(questionDetail => questionDetail.json())
      .then(question => { 
        this.questionContent = question; 
        this.routeConfig.navModel.setTitle(question.headline);
      });

    var answerPromise = this.httpClient.fetch(`answers/question/${params.id}`)
      .then(response => response.json())
      .then(answers => { 
        this.answers = answers; 
      });

    return Promise.all([questionPromise, answerPromise]);
  }

  attached() {
    this.subscriber = this.ea.subscribe('questionAnswered', message => {
      this.httpClient.fetch(`answers/question/${message.id}`)
        .then(response => response.json())
        .then(answers => { 
          this.answers = answers;
                console.log(answers);
        });    
    });
  }

  detached() {
    this.subscriber.dispose();
  }
}