import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';
import { baseAPI } from '../config';

interface CategoryResponse {
  Data: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private http: HttpClient
  ) { }

  getCategories(params: HttpParams): Observable<CategoryResponse> {
    const url = `${baseAPI}/category`;

    return this.http.get<CategoryResponse>(url, { params });
  }

  saveCategory(params: HttpParams, body: FormData): Observable<CategoryResponse> {
    const url = `${baseAPI}/category`;

    return this.http.post<CategoryResponse>(url, body, { params });
  }

  updateCategory(params: HttpParams, body: FormData): Observable<CategoryResponse> {
    const url = `${baseAPI}/category/attr`;

    return this.http.post<CategoryResponse>(url, body, { params });
  }

  deleteCategories(params: HttpParams): Observable<CategoryResponse> {
    const url = `${baseAPI}/category`;
  
    return this.http.delete<CategoryResponse>(url, { params });
  }
}
