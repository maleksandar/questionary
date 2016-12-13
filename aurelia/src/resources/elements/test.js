import {bindable} from 'aurelia-framework';

export class Test {
  @bindable value;

  valueChanged(newValue, oldValue) {

  }
}

