import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publisher } from '../interfaces/publisher';
import { baseAPI } from '../config';

interface PublisherResponse {
  Data: Publisher[];
}

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  constructor(
    private http: HttpClient
  ) { }

  getPublishers(params: HttpParams): Observable<PublisherResponse> {
    const url = `${baseAPI}/publisher`;

    return this.http.get<PublisherResponse>(url, { params });
  }

  savePublisher(params: HttpParams, body: FormData): Observable<PublisherResponse> {
    const url = `${baseAPI}/publisher`;

    return this.http.post<PublisherResponse>(url, body, { params });
  }

  updatePublisher(params: HttpParams, body: FormData): Observable<PublisherResponse> {
    const url = `${baseAPI}/publisher/attr`;

    return this.http.post<PublisherResponse>(url, body, { params });
  }

  deletePublisher(params: HttpParams): Observable<PublisherResponse> {
    const url = `${baseAPI}/publisher`;
  
    return this.http.delete<PublisherResponse>(url, { params });
  }
}
