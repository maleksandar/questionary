import { bindable, inject, computedFrom } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(HttpClient, EventAggregator)
export class QuestionFilter {
  constructor(httpClient, ea) {
    this.httpClient = httpClient;
    this.ea = ea;
    this.tags = [];
    this.httpClient.fetch('domains')
      .then(response => response.json())
      .then(domains => { this.domains = domains; })
      .catch(reason => { console.log(reason); });
  }

  filter() {
    this.ea.publish('questionsFiltered', { 
      questionText: this.questionText,
      tags: this.tags,
      domain: this.domain.text,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo
    });
  }

  addTag() {
    if(this.tag) {
      this.tags.push(this.tag);
      this.tag = "";
    }
  }

  removeTag(tagText) {
    var index = this.tags.indexOf(tagText);
    if (index > -1) {
        this.tags.splice(index, 1);
    }
  }
}