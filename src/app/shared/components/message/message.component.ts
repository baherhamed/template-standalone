import { Component, Input } from '@angular/core';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input('type') type?: string;
  @Input('title') title?: string;
  @Input('message') message?: string;
}
