import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DialogService, getTokenValue, systemLanguages, systemMessage } from '../..';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent implements AfterViewInit {
  // @Input('type') type?: string;
  // @Input('title') title?: string;
  // @Input('message') message?: string;
  @ViewChild('systemMessageTemplate') systemMessageTemplate!: systemMessage;
  @Input('systemMessage') systemMessage!: systemMessage;
  @Output('action') action = new EventEmitter<Number>();
  displayMessage: string = ""
  constructor(private dialog: DialogService,) { }

  // ngOnInit(): void {
  //   // console.log('systemMessage', this.systemMessage);
  //   this.showSystemMessage(this.systemMessageTemplate)
  // }

  async ngAfterViewInit() {
    this.systemMessage.titleClass = this.systemMessage.titleClass ? this.systemMessage.titleClass : 'model-header'
    await this.displayMessageLanguage(this.systemMessage.message);
    this.showSystemMessage(this.systemMessageTemplate);
  }


  showSystemMessage(templateRef: unknown) {
    this.dialog.showSystemMessage(templateRef);
  }

  async displayMessageLanguage(message: systemLanguages) {
    const { language } = await getTokenValue();
    console.log('language', language);
    console.log('message', message);
    this.displayMessage = message.ar === language ? message.ar : message.en;
  }

  resetMessage() {
    this.systemMessage = {
      show: false,
      title: '',
      titleClass: '',
      message: { ar: '', en: '' },
      action: 0
    }
    this.action.emit(this.systemMessage.action);
  }
  accept() {
    this.systemMessage = {
      show: false,
      title: '',
      titleClass: '',
      message: { ar: '', en: '' },
      action: 1
    }
    this.action.emit(this.systemMessage.action);
  }

}
