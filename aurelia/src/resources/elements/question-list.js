import { bindable, inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(HttpClient, EventAggregator)
export class QuestionList {
  @bindable source;
  @bindable value;

  constructor(httpClient, ea) {
    this.httpClient = httpClient;
    this.ea = ea;
    this.pageIndexes = [];
    this.questions = [];
    this.questionsIsNotEmpty = false;
    this.paginationLower = false;
    this.paginationGreater = false;
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
      this.request = 'questions/mine?limit=3';
    } else {
      this.request = 'questions?include=Answers&include=Tags'
    }

    return this.request;
  }

  getQuestions() {
    this.httpClient.fetch(this.request )
      .then(response => response.json())
      .then(responseObj => {
        if(responseObj.count != 0) {
          this.setParams(responseObj);
          this.currentIndex = 0;
        } else {
          this.questions = [];
          this.questionsIsNotEmpty = false;
          this.paginationGreater = false;
          this.paginationLower = false;
          this.currentIndex = 0;
        }
    });
  }

  valueChanged(newValue, oldValue) {
  } 

  setPage(index) {
    this.httpClient.fetch(this.request + `&offset=${index*3}`)
      .then(response => response.json())
      .then(responseObj => {
        this.setParams(responseObj);
      });
      this.currentIndex = index;
  }

  getPages(index) {
    if(index <= 1)
      return this.pageIndexes.slice(1, 4);
    else if(index > 1 && (index <= (this.pageIndexes.length - 3)))
      return this.pageIndexes.slice(index-1, index+2);
    else if(index > 1 && (index > (this.pageIndexes.length - 3)))
      return this.pageIndexes.slice(this.pageIndexes.length-4, this.pageIndexes.length-1);
  }

  setParams(responseObj) {
    if(responseObj.count != 0) {
      console.log(responseObj);
      this.questions = responseObj.rows;
      this.questionsIsNotEmpty = true;
      var count = responseObj.count;
      if(count % 3 == 0)
        this.pageIndexes = Array.from(new Array(Math.floor(count / 3)), (x,i) => i);
      else
        this.pageIndexes = Array.from(new Array(Math.floor(count / 3) + 1), (x,i) => i);
      this.paginationLower = this.questionsIsNotEmpty && (this.pageIndexes.length <= 5);
      this.paginationGreater = this.questionsIsNotEmpty && (this.pageIndexes.length > 5); 
    } else  {
      this.paginationGreater = false;
      this.paginationLower = false;
      this.questionsIsNotEmpty = false;
      this.questions = [];
      this.currentIndex = 0;
    }
  }

  detached() {
    this.filterSubscriber.dispose();
    this.questionAddedSubscriber.dispose();
    this.questionDeletedSubscriber.dispose();
  }
}

