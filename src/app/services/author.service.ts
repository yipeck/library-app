import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from '../interfaces/author';
import { baseAPI } from '../config';

interface AuthorResponse {
  Data: Author[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(
    private http: HttpClient
  ) { }

  getAuthors(params: HttpParams): Observable<AuthorResponse> {
    const url = `${baseAPI}/author`;

    return this.http.get<AuthorResponse>(url, { params });
  }

  saveAuthor(params: HttpParams, body: FormData): Observable<AuthorResponse> {
    const url = `${baseAPI}/author`;

    return this.http.post<AuthorResponse>(url, body, { params });
  }

  updateAuthor(params: HttpParams, body: FormData): Observable<AuthorResponse> {
    const url = `${baseAPI}/author/update`;

    return this.http.post<AuthorResponse>(url, body, { params });
  }

  deleteAuthor(params: HttpParams): Observable<AuthorResponse> {
    const url = `${baseAPI}/author`;
  
    return this.http.delete<AuthorResponse>(url, { params });
  }

  countByCountry(params: HttpParams, cid: number): Observable<AuthorResponse> {
    const url = `${baseAPI}/author/count/${cid}`;

    return this.http.get<AuthorResponse>(url, { params });
  }
}
