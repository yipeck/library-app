import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/auth.service';
import { Author } from 'src/app/interfaces/author';
import { Book } from 'src/app/interfaces/book';
import { Category } from 'src/app/interfaces/category';
import { Country } from 'src/app/interfaces/country';
import { Publisher } from 'src/app/interfaces/publisher';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  constructor(
    private storage: Storage,
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private bookService: BookService
  ) { }

  authService: AuthService;

  title: string = '';
  avatar: string = '';
  authors: Author[] = [];
  categories: Category[] = [];
  countries: Country[] = [];
  publishers: Publisher[] = [];
  books: Book[] = [];

  getAuthorName(authorId: number): string {
    const result = this.authors.filter(author => author.Id == authorId);

    return result.length > 0 ? result[0].Name : '';
  }

  getCountryNameByCountryId(countryId: number): string {
    const result = this.countries.filter(country => country.Id == countryId);

    return result.length > 0 ? result[0].Name : '';
  }

  getCountryNameByAuthorId(authorId: number): string {
    const result = this.authors.filter(author => author.Id == authorId);

    return result.length > 0 ? this.getCountryNameByCountryId(result[0].CountryId) : '';
  }

  getBooksByType(type: string, id: number) {
    this.bookService.getBooksByType(this.authService.getAuthParams(), type, id)
      .subscribe(res => this.books = res.Data || []);
  }

  getAuthorById(id: number): { name: string, avatar: string } {
    const result = this.authors.filter(author => author.Id == id);

    return result[0] ? { name: result[0].Name, avatar: result[0].Avatar } : { name: '', avatar: '' };
  }

  getCategoryTitleById(id: number) {
    const result = this.categories.filter(category => category.Id == id);

    return result[0] ? result[0].Title : '';
  }

  getPublisherNameById(id: number) {
    const result = this.publishers.filter(publisher => publisher.Id == id);

    return result[0] ? result[0].Name : '';
  }

  getBooks() {
    this.activatedRoute.params.subscribe(data => {
      const { type, value } = data;

      this.getBooksByType(type, value);
    });
  }

  async presentDeleteAlert(id: string) {
    const alert = await this.alertCtrl.create({
      header: '确认删除？',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        }, {
          text: '确认',
          handler: () => this.deleteBook(id)
        }
      ]
    });

    await alert.present();
  }

  deleteBook(id: string) {
    this.bookService.deleteBook(this.authService.getAuthParams(), id)
      .subscribe(() => this.getBooks());
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async ionViewWillEnter() {
    this.authService = new AuthService(await this.storage.get('token'));
    this.getBooks();
  }

  async ionViewDidEnter() {
    this.authors = await this.storage.get('authors');
    this.categories = await this.storage.get('categories');
    this.countries = await this.storage.get('countries');
    this.publishers = await this.storage.get('publishers');

    this.activatedRoute.params.subscribe(data => {
      const { type, value } = data;

      switch(type) {
        case 'status':
          this.title = '完成阅读';
          break;
        case 'category':
          this.title = this.getCategoryTitleById(value);
          break;
        case 'author':
          const { name, avatar } = this.getAuthorById(value);

          this.title = name;
          this.avatar = avatar;
          break;
        case 'publisher':
          this.title = this.getPublisherNameById(value);
          break;
      }
    });
  }
}
