import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export enum Loop {
  Random = 'random',
  None = 'none',
  Single = 'single',
  List = 'list',
}

export interface LRC {
  time: number;
  txt: string;
}

export interface Music {
  name: string;
  url: string;
  lrc: string;
  time: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  lrc(src: string) {
    return this.http.get(src, { responseType: 'text' });
  }

  list() {
    return this.http.get('assets/list.json');
  }
}
