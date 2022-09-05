import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/auth.service';
import { Author } from 'src/app/interfaces/author';
import { Book } from 'src/app/interfaces/book';
import { Category } from 'src/app/interfaces/category';
import { Country } from 'src/app/interfaces/country';
import { Publisher } from 'src/app/interfaces/publisher';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {
  constructor(
    public toastCtrl: ToastController,
    private storage: Storage,
    private activatedRoute: ActivatedRoute,
    private bookService: BookService
  ) { }

  authService: AuthService;
  isFocus = false;
  books: Book[] = [];
  authors: Author[] = [];
  categories: Category[] = [];
  countries: Country[] = [];
  publishers: Publisher[] = [];

  setIsFocus() {
    this.isFocus = true;
  }

  getAuthorName(authorId: number): string {
    const result = this.authors.filter(author => author.Id == authorId);

    return result.length > 0 ? result[0].Name : '';
  }
  
  getCategoryTitleById(id: number) {
    const result = this.categories.filter(category => category.Id == id);

    return result[0] ? result[0].Title : '';
  }

  getCountryNameByCountryId(countryId: number): string {
    const result = this.countries.filter(country => country.Id == countryId);

    return result.length > 0 ? result[0].Name : '';
  }

  getCountryNameByAuthorId(authorId: number): string {
    const result = this.authors.filter(author => author.Id == authorId);

    return result.length > 0 ? this.getCountryNameByCountryId(result[0].CountryId) : '';
  }

  getPublisherName(publisherId: number): string {
    const result = this.publishers.filter(publisher => publisher.Id == publisherId);

    return result.length > 0 ? result[0].Name : '';
  }

  getBookById(id: string) {
    this.bookService.getBookById(this.authService.getAuthParams(), id)
      .subscribe(res => this.books = res.Data || []);
  }

  updateReadStatus(event, id: number) {
    if (!this.isFocus) {
      return;
    }

    const readStatus = event.detail.value;
    const formData = new FormData();

    formData.append('readStatus', readStatus);
    formData.append('id', String(id));
    
    this.bookService.updateReadStatus(this.authService.getAuthParams(), formData)
      .subscribe(async res => {
        let message = '';

        if (readStatus == -1) {
          message = '阅读状态已更新为：暂未阅读';
        } else if (readStatus == 0) {
          message = '阅读状态已更新为：正在阅读';
        } else if (readStatus == 1) {
          message = '阅读状态已更新为：完成阅读';
        }

        if (!res.Success) {
          message = '阅读状态更新失败'
        }
        const toast = await this.toastCtrl.create({
          position: 'top',
          message: message,
          duration: 1000
        });

        toast.present();
      });
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async ionViewWillEnter() {
    this.authService = new AuthService(await this.storage.get('token'));
    this.activatedRoute.params.subscribe(data => {
      const { id } = data;

      this.getBookById(id);
    });
  }

  async ionViewDidEnter() {
    this.authors = await this.storage.get('authors');
    this.categories = await this.storage.get('categories');
    this.countries = await this.storage.get('countries');
    this.publishers = await this.storage.get('publishers');
  }
}
