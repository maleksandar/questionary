import {inject} from 'aurelia-framework';
import {SharedResources} from '../config/sharedResources';

@inject(SharedResources)
export class Questions {
  constructor(sharedResources) {
    this.message = "hello";
    this.sharedResources = sharedResources;
  }
}