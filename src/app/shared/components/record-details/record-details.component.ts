import { Component, Input } from '@angular/core';
import { RecordDetails } from '../..';

@Component({
  selector: 'record-details',
  templateUrl: './record-details.component.html',
  styleUrls: ['./record-details.component.scss'],
})
export class RecordDetailsComponent {
  @Input('addInfo') addInfo?: RecordDetails;
  @Input('lastUpdateInfo') lastUpdateInfo?: RecordDetails;
}
