import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AudioService } from '../services/audio.service';
import { Loop } from '../services/data.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Output() showshow = new EventEmitter();

  btnClass = {};
  index = 0;
  lrc: any[] = [];

  @ViewChild('res', { static: false }) res: any;

  isPalying = false;

  blockckckc = false;
  list = ['btn-order-list', 'btn-order-random', 'btn-order-single'];
  constructor(
    private http: HttpClient,
    private audio: AudioService,
    private ele: ElementRef
  ) {
    this.btnClass = { [this.list[this.index]]: true };

    this.audio.index$.subscribe((index) => {
      this.isPalying = index >= 0;
    });

    let input: HTMLInputElement;
    let aaa: HTMLLabelElement;
    let bbb: HTMLLabelElement;

    this.audio.progress$.subscribe((res) => {
      if (!input) {
        input = this.ele.nativeElement.querySelector('.ddddd');
        aaa = this.ele.nativeElement.querySelector('.aaa');
        bbb = this.ele.nativeElement.querySelector('.bbb');
      }

      if (aaa) {
        aaa.innerHTML = res.currentTime;
        bbb.innerHTML = res.totalTime;
      }

      if (this.blockckckc) {
        return;
      }

      if (input && res.value) {
        input.value = String(res.value);
      }
    });
  }

  onmousedown(e: Event) {
    this.blockckckc = true;
  }
  onmouseout(e: Event) {
    this.blockckckc = false;
  }

  getFormatTimeBySecend(time: any) {
    var _time = parseInt(time);
    var hours = Math.floor(_time / 3600);
    var minutes = Math.floor((_time - hours * 3600) / 60);
    var seconds = _time - hours * 3600 - minutes * 60;
    return (
      (hours > 0 ? hours + ':' : '') +
      (minutes <= 9 ? '' : '') +
      minutes +
      ':' +
      (seconds <= 9 ? '0' : '') +
      seconds
    );
  }

  switch() {
    const next = ++this.index;

    if (next > this.list.length - 1) {
      this.index = 0;
    } else {
      this.index = next;
    }

    switch (this.index) {
      case 0:
        this.audio.loop = Loop.List;
        break;
      case 1:
        this.audio.loop = Loop.None;
        break;
      case 2:
        this.audio.loop = Loop.Random;
        break;
    }

    this.btnClass = { [this.list[this.index]]: true };
  }

  next(i: number) {
    if (i) {
      this.audio.next();
    } else {
      this.audio.prev();
    }
  }

  ok() {
    this.isPalying = !this.isPalying;
    if (this.isPalying) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  fde = false;
  long() {
    this.fde = !this.fde;
  }

  gottt(e: Event) {
    console.log(e);
  }

  fdasfa(e: HTMLInputElement | any) {
    this.isPalying = true;
    this.audio.gotobytimeline(parseFloat(e.value));
  }

  ddddd() {
    this.dialoggg = !this.dialoggg;
    this.showshow.next(this.dialoggg);
  }

  dialoggg = true;
}
