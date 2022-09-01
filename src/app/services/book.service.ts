import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book';
import { baseAPI } from '../config';

interface BookResponse {
  Success: boolean;
  Data: Book[];
}

interface CountResponse {
  Success: boolean;
  Data: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(
    private http: HttpClient
  ) { }

  getBookById(params: HttpParams, id: string): Observable<BookResponse> {
    const url = `${baseAPI}/book/${id}`;

    return this.http.get<BookResponse>(url, { params });
  }

  getBooksByType(params: HttpParams, type: string, value: number): Observable<BookResponse> {
    const url = `${baseAPI}/book/${type}/${value}`;

    return this.http.get<BookResponse>(url, { params });
  }

  getBooksBoughtThisMonth(params: HttpParams): Observable<BookResponse> {
    const url = `${baseAPI}/book/bought`;

    return this.http.get<BookResponse>(url, { params });
  }

  saveBook(params: HttpParams, body: FormData): Observable<BookResponse> {
    const url = `${baseAPI}/book`;

    return this.http.post<BookResponse>(url, body, { params });
  }

  deleteBook(params: HttpParams, id: string): Observable<BookResponse> {
    const url = `${baseAPI}/book/${id}`;
  
    return this.http.delete<BookResponse>(url, { params });
  }

  updateReadStatus(params: HttpParams, body: FormData): Observable<BookResponse> {
    const url = `${baseAPI}/book/status`;

    return this.http.put<BookResponse>(url, body, { params });
  }

  countBooksByType(params: HttpParams, type: string, value: number): Observable<CountResponse> {
    const url = `${baseAPI}/book/count/${type}/${value}`;

    return this.http.get<CountResponse>(url, { params });
  }
}
