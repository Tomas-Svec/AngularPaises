import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delayWhen, map, of } from 'rxjs';
import { Country } from '../interfaces/country';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1'

  constructor(private http: HttpClient) { }

  private getCountriespRequest( url:string): Observable<Country[]>{
    return this.http.get<Country[]>(url)
    .pipe(
      catchError( ()=> of([]) ),
      //delay(200),
    );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null>{

    const url = `${this.apiUrl}/alpha/${code}`;

    return this.http.get<Country[]>(url)
    .pipe(
      map(countries => countries.length > 0 ? countries[0]: null),
      catchError(error => of(null))
    );
  }

  searchCapital(term: string): Observable<Country[]> {

    const url = `${this.apiUrl}/capital/${term}`;

    return this.getCountriespRequest(url);
  }

  searchCountry(term: string): Observable<Country[]>{

    const url = `${this.apiUrl}/name/${term}`;

    return this.getCountriespRequest(url);
  }

  searchRegion(region: string): Observable<Country[]>{

    const url = `${this.apiUrl}/region/${region}`;

    return this.getCountriespRequest(url);
  }

}
function delay(arg0: number): import("rxjs").OperatorFunction<Country[] | never[], Country[]> {
  throw new Error('Function not implemented.');
}

