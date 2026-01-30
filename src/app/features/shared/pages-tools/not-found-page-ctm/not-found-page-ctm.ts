import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page-ctm',
  standalone: true,
  imports: [],
  templateUrl: './not-found-page-ctm.html',
  styleUrl: './not-found-page-ctm.css',
})
export class NotFoundPageCtm {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigateByUrl('/dashboard/client/home');
  }
}
