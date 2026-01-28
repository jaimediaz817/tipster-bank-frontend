import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackButton } from '../../shared/back-button/back-button';
import { PageContainer } from '../../shared/pages-tools/page-container/page-container';

@Component({
  selector: 'app-reports-list-page',
  standalone: true,
  imports: [RouterLink, BackButton, PageContainer],
  templateUrl: './reports-list-page.html',
  styleUrl: './reports-list-page.css',
})
export class ReportsListPage {

}
