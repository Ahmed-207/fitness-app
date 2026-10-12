import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooterComponent } from '../../../shared/components/site-footer/site-footer.component';
import { SiteNavbarComponent } from '../../../shared/components/site-navbar/site-navbar.component';
import { SmartCoachChatComponent } from '../../../shared/components/smart-coach-chat/smart-coach-chat.component';

@Component({
  selector: 'app-site-layout',
  imports: [RouterOutlet, SiteNavbarComponent, SiteFooterComponent, SmartCoachChatComponent],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteLayoutComponent {}
