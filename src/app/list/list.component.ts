import { Component, EventEmitter, Output } from '@angular/core';
import { filter } from 'rxjs';
import { Music } from '../services/data.service';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  @Output() colonsesewe = new EventEmitter();

  list: Music[] = [];
  index: number = 0;
  constructor(private audio: AudioService) {
    this.audio.list$.pipe(filter((res) => res.length > 0)).subscribe((list) => {
      this.list = list;
    });

    this.audio.index$.subscribe((index) => {
      this.index = index;
    });
  }

  play(i: number) {
    this.audio.play(i);
  }

  dfdasf() {
    this.colonsesewe.next(true);
  }
}
