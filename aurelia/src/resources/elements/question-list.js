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
    this.subscriber = this.ea.subscribe('questionsFiltered', message => {
      this.filter = message;
      let request = this.getRequestBase();
      if(message.domain) {
        request += `&domainFilter=${message.domain}`
      }
      if(message.questionText) {
        request += `&questiontextFilter=${message.questionText}`
      }
      if(message.tags.length) {
        message.tags.forEach(tag => {request+= `&tagFilter=${tag}`});
      }
      this.getQuestions(request);
    });

    this.getQuestions(this.getRequestBase());
  }

  getRequestBase() {
    let request = '';
    if(this.source === 'pinned') {
      request = 'questions/pinned?';
    } else if(this.source === 'mine') {
      request = 'questions/mine?';
    } else {
      request = 'questions?include=Answers&include=Tags'
    }

    return request;
  }

  getQuestions(request) {
    this.httpClient.fetch(request)
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
    this.subscriber.dispose();
  }

  // valueChanged(newValue, oldValue) {
  //   this.questions = this.qss[newValue];
  // }

  // setPage(index) {
  //   this.currentIndex = index;
  // }
}

