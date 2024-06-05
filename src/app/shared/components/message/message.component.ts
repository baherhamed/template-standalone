import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { DialogService, getTokenValue, site, systemLanguages, systemMessage } from '../..';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent implements OnChanges {
  @ViewChild('systemMessageTemplate') systemMessageTemplate!: systemMessage;
  @Input('systemMessage') systemMessage!: systemMessage;
  @Output('action') action: EventEmitter<number> = new EventEmitter();
  displayMessage: string = "";
  language: string = "";
  dir: any;
  constructor(private dialog: DialogService,) { }


  async ngOnChanges() {
    this.systemMessage.titleClass = this.systemMessage.titleClass ? this.systemMessage.titleClass : 'model-header';
    await this.displayMessageLanguage(this.systemMessage.message);
    this.showSystemMessage(this.systemMessageTemplate);
  }

  showSystemMessage(templateRef: unknown) {
    this.dialog.showSystemMessage(templateRef);
  }

  async displayMessageLanguage(message: systemLanguages) {
    const { language } = await getTokenValue();
    this.displayMessage = language && language === site.language.ar ? message.ar : message.en;
  }

  accept(action: number) {
    this.action.emit(action);
  }

}
