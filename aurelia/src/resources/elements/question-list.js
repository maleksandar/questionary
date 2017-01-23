import { bindable, inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(HttpClient, EventAggregator)
export class QuestionList {
  @bindable source;

  constructor(httpClient, ea) {
    this.httpClient = httpClient;
    this.ea = ea;
    this.qss = [];
    this.pageIndexes = [];
    this.qssIsNotEmpty = false;
  }

  attached() {
    this.filterSubscriber = this.ea.subscribe('questionsFiltered', message => {
      this.filter = message;
      this.setRequestBase();

      if(message.domain) {
        this.request += `&domainFilter=${message.domain}`
      }
      if(message.questionText) {
        this.request += `&questiontextFilter=${message.questionText}`
      }
      if(message.tags.length) {
        message.tags.forEach(tag => {this.request+= `&tagFilter=${tag}`});
      }
      this.getQuestions();
    });

    this.questionAddedSubscriber = this.ea.subscribe('questionAdded', message => {
      this.getQuestions();
    });

    this.questionDeletedSubscriber = this.ea.subscribe('questionDeleted', mesage => {
      this.getQuestions();
    });

    this.setRequestBase();
    this.getQuestions();
  }

  setRequestBase() {
    this.request = '';
    if(this.source === 'pinned') {
      this.request = 'questions/pinned?';
    } else if(this.source === 'mine') {
      this.request = 'questions/mine?';
    } else {
      this.request = 'questions?include=Answers&include=Tags'
    }

    return this.request;
  }

  getQuestions() {
    this.httpClient.fetch(this.request)
      .then(response => response.json())
      .then(questions => {
        this.questions = questions;
        this.qss = [];
        while(this.questions.length != 0)
          this.qss.push(this.questions.splice(0,6));
        this.qssIsNotEmpty = this.qss.length != 0;
        if(this.qssIsNotEmpty) {
          this.questions = this.qss[0];
          this.currentIndex = 0;
          this.pageIndexes = Array.from(new Array(this.qss.length), (x,i) => i);
        }
    });
  }

  detached() {
    this.filterSubscriber.dispose();
    this.questionAddedSubscriber.dispose();
    this.questionDeletedSubscriber.dispose();

  }
}

