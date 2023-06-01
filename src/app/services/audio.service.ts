import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService, Loop, LRC, Music } from './data.service';
import { add, subtract, multiply, divide } from 'mathjs';

interface JGYBIProgress {
  currentTime: string;
  totalTime: string;
  value: number;
}

const jGYBIProgress: JGYBIProgress = {
  currentTime: '00:00',
  totalTime: '00:00',
  value: 0,
};

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audio: HTMLAudioElement = new Audio();
  private lrc: LRC[] = [];
  private list: Music[] = [];
  private timeline = -1;

  private index = 0;

  loop = Loop.None;

  newName$ = new BehaviorSubject('');
  lrc$ = new BehaviorSubject(this.lrc);
  list$ = new BehaviorSubject(this.list);
  progress$ = new BehaviorSubject<JGYBIProgress>(jGYBIProgress);
  index$ = new BehaviorSubject(-1);
  timeline$ = new BehaviorSubject(this.timeline);

  constructor(private data: DataService) {
    this.init();
    this.data.list().subscribe((res: any) => {
      const aa = [...res, ...res, ...res];
      this.list = [...aa, ...aa];
      this.list$.next(this.list);
      this.load(false);
    });
  }

  goto(m: number) {
    this.audio.currentTime = m;
  }

  gotobytimeline(nn: number) {
    const a = this.audio.duration;
    if (a) {
      this.goto(multiply(a, divide(nn, 100)));
      this.audio.play();
    }
  }

  init() {
    this.audio.preload = 'auto';
    this.audio.controls = true;
    // this.audio.currentTime = 60 * 4 + 50;
    // this.audio.currentTime = 50;
    this.audio.ontimeupdate = () => this.ontimeupdate();
    this.audio.addEventListener('loadedmetadata', () => {
      const d = this.audio.duration;
    });
    this.audio.addEventListener('ended', () => {
      this.progress$.next(jGYBIProgress);
    });
  }

  private load(play = true) {
    this.audio.pause();
    const data = this.list[this.index];
    if (!data) return;
    this.newName$.next(data.name);
    this.audio.src = data.url;
    this.loadLrc(data.lrc);
    play && this.audio.play();
  }

  play(i?: number) {
    if (i != undefined) {
      this.index = i;
      this.load();
    }
    this.index$.next(this.index);
    this.audio.play();
  }

  pause() {
    this.index$.next(-1);
    this.audio.pause();
  }

  prev() {
    this.index--;
    if (this.index < 0) {
      this.index = 0;
    } else {
      this.index$.next(this.index);
    }
    this.load();
  }

  next() {
    this.index++;
    const max = this.list.length - 1;
    if (this.index > max) {
      this.index = max;
    } else {
      this.index$.next(this.index);
    }
    this.load();
  }

  stoms(m: number) {
    if (m !== 0 && !m) {
      return jGYBIProgress.currentTime;
    }

    const aa = divide(m, 60).toFixed(2);
    return aa.replace('.', ':');
  }

  ontimeupdate() {
    const time = this.audio.currentTime;
    const all = this.audio.duration;

    const aa = multiply(divide(time, all), 100);

    const __dd: JGYBIProgress = {
      currentTime: this.stoms(time),
      totalTime: this.stoms(all),
      value: aa,
    };

    this.progress$.next(__dd);

    const index = this.lrc.findIndex((obj, i) => {
      const next = this.lrc[i + 1];
      if (time >= obj.time && next && time < next.time) {
        return true;
      }
      return false;
    });
    if (index == -1) return;

    if (this.timeline != index) {
      this.timeline$.next(index);
    }
    this.timeline = index;
  }

  formatter(str: string) {
    // "[00:00.266] today I'm going to talk to you about some"
    const eeee = str.split(']');
    const time = eeee[0].split('[')[1];
    const txt = eeee[1];

    const ssss = time.split(':');

    const mmm = multiply(parseInt(ssss[0]), 60);
    let t = add(mmm, parseFloat(ssss[1]));

    if (t) {
      t = parseFloat(t.toFixed(4));
    }

    return {
      time: t,
      txt,
    };
  }

  loadLrc(src: string) {
    this.data.lrc(src).subscribe((txt) => {
      let data = txt.split('\n');

      if (data.length < 3) {
        data = txt.split('\r');
      }
      this.lrc = data.map((s) => this.formatter(s)).filter((o) => o.time);
      this.lrc$.next(this.lrc);
    });
  }
}
