import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageContainer } from '../../../shared/pages-tools/page-container/page-container';

@Component({
  selector: 'app-client-dashboard-home',
  standalone: true,
  imports: [CommonModule, PageContainer, PageContainer],
  templateUrl: './client-dashboard-home-page.html',
  styleUrls: ['./client-dashboard-home-page.css'],
})
export class ClientDashboardHomePage {

}
