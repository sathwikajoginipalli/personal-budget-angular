import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';

@Injectable({
 providedIn: 'root'
})
export class DataService {

 constructor(private http: HttpClient) {
  }
 dataObservable: Observable<any>;

 public url = 'http://localhost:3000/budget';

 Budget(): Observable<any> {
  if (this.dataObservable) {
    return this.dataObservable;
  } else {
    this.dataObservable = this.http.get(this.url).pipe(shareReplay());
    return this.dataObservable;
  }
}
// Budget() {
//   return this.http.get(this.url);
// }
}
