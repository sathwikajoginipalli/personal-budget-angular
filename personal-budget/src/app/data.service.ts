import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class DataService {

 constructor(private http: HttpClient) {

  }
  dataSource =  []; //
  // tslint:disable-next-line: variable-name
  public _url = 'http://localhost:3000/budget';
 // tslint:disable-next-line: typedef
 Budget(): Observable<any>{
  return this.http.get(this._url);
}
}
