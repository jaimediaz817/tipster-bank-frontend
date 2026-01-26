import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackButton } from '../../shared/back-button/back-button';

@Component({
  selector: 'app-reports-list-page',
  standalone: true,
  imports: [RouterLink, BackButton],
  templateUrl: './reports-list-page.html',
  styleUrl: './reports-list-page.css',
})
export class ReportsListPage {

}
