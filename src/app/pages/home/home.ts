import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Calendar } from '../../shared/components/calendar';

@Component({
  selector: 'app-home',
  imports: [Calendar],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
