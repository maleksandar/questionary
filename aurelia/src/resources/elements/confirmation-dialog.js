import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController)
export class ConfirmationDialog {
  constructor(dialogController) {
    this.dialogController = dialogController;
  }

  activate(content) {
    this.message = content.message;
    this.headline = content.headline;
  }
}