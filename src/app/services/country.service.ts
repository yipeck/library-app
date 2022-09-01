import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Country } from '../interfaces/country';
import { baseAPI } from '../config';

interface CountryResponse {
  Data: Country[];
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor(
    private http: HttpClient
  ) { }

  getCountries(params: HttpParams): Observable<CountryResponse> {
    const url = `${baseAPI}/country`;

    return this.http.get<CountryResponse>(url, { params });
  }

  saveCountry(params: HttpParams, body: FormData): Observable<CountryResponse> {
    const url = `${baseAPI}/country`;

    return this.http.post<CountryResponse>(url, body, { params });
  }

  updateCountry(params: HttpParams, body: FormData): Observable<CountryResponse> {
    const url = `${baseAPI}/country/attr`;

    return this.http.post<CountryResponse>(url, body, { params });
  }

  deleteCountry(params: HttpParams): Observable<CountryResponse> {
    const url = `${baseAPI}/country`;
  
    return this.http.delete<CountryResponse>(url, { params });
  }
}
