import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
 providedIn: 'root'
})
export class DataService {

 constructor(private http: HttpClient) {

  }
 // tslint:disable-next-line: typedef
 Budget(){
   return this.http.get('http://localhost:3000/budget');
 }
}
