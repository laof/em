import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'music';
  constructor(private d: AudioService, private router: Router) {}

  test(r: string) {
    this.router.navigateByUrl(r);
  }

  haha = false;
  fdfa(bb: boolean) {
    this.haha = !this.haha;
  }
}
