import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store-interface';
import { Region } from '../interfaces/region.type';


@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1';


  public cacheStore: CacheStore = {
    byCapital: {term: '', countries: []},
    byCountries: {term: '', countries: []},
    byRegion: { region: '', countries: []},
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorate();
  }

  private saveToLocalStorate(){
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorate(){
    if(!localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')! );
  }

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
    return this.getCountriespRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byCapital = {term, countries} ),
      tap( () => this.saveToLocalStorate()),
    );
  }

  searchCountry(term: string): Observable<Country[]>{
    const url = `${this.apiUrl}/name/${term}`;
    return this.getCountriespRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byCountries = {term, countries} ),
      tap( () => this.saveToLocalStorate()),
    );
  }

  searchRegion(region: Region): Observable<Country[]>{
    const url = `${this.apiUrl}/region/${region}`;
    return this.getCountriespRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byRegion = {region, countries} ),
      tap( () => this.saveToLocalStorate()),
    );
  }

}
function delay(arg0: number): import("rxjs").OperatorFunction<Country[] | never[], Country[]> {
  throw new Error('Function not implemented.');
}

