import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxIcon } from 'ngx-icons-extra';
import { ThemeService } from './shared/services/theme.service';
import { NotificationService } from './shared/services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxIcon],
  templateUrl: './app.html',
})
export class App {
  readonly theme = inject(ThemeService);
  readonly notifications = inject(NotificationService);
}
