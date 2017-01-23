import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
var toastr = require('toastr');


@inject(HttpClient, toastr, EventAggregator)
export class QuestionForm {
  constructor(httpClient, toastr, ea) {
    this.httpClient = httpClient;
    this.toastr = toastr;
    this.ea = ea;
    this.tags = [];
    this.tag = "";
    this.httpClient.fetch('domains')
      .then(response => response.json())
      .then(domains => { this.domains = domains; console.log("Domains:", this.domains)})
      .catch(reason => { console.log(reason); });
  }

  postQuestion() {
    var tagObjects = this.tags.map(tag => { return { text: tag }; })
    return this.httpClient.fetch('questions', {
      method: 'post',
      body: json({ headline: this.headline, text: this.text, Tags: tagObjects, DomainText: this.domain.text })
    })
    .then(() => {
      this.toastr.success('You have successfully posted your question');
      this.headline = "";
      this.text = "";
      this.tags = [];
      this.tag = "";
      this.ea.publish('questionAdded');
    })
    .catch(() => this.serverError = true);
  }

  removeTag(tagText) {
    var index = this.tags.indexOf(tagText);
    if (index > -1) {
        this.tags.splice(index, 1);
    }
  }

  addTag() {
    if(this.tag) {
      this.tags.push(this.tag);
      this.tag = "";
    }
  }
}