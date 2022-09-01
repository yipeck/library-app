import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Author } from 'src/app/interfaces/author';
import { Country } from 'src/app/interfaces/country';
import { AuthorService } from 'src/app/services/author.service';
import { AuthService } from 'src/app/auth.service';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.page.html',
  styleUrls: ['./author.page.scss'],
})
export class AuthorPage implements OnInit {
  constructor(
    private storage: Storage,
    private alertCtrl: AlertController,
    private imagePicker: ImagePicker,
    private router: Router,
    private authorService: AuthorService,
    private bookService: BookService
  ) { }

  letters = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  authService: AuthService;
  isOpen: boolean = false;
  countries: Country[] = [];
  authors: Author[][] = [];

  Id: number = 0;
  Name: string = '';
  CountryId: number = 0;
  Avatar: string = '';
  Letter: string = '';

  setIsOpen(value: boolean) {
    this.isOpen = value;

    if (!value) {
      this.Id = 0;
      this.Name = '';
      this.CountryId = 0;
      this.Avatar = '';
      this.Letter = '';
    }
  }

  async presentDeleteTipAlert() {
    const alert = await this.alertCtrl.create({
      header: '删除提示',
      subHeader: '作家中尚存图书，无法删除！',
      buttons: [
        {
          text: '确认',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async presentDeleteAlert(id: number) {
    const alert = await this.alertCtrl.create({
      header: '确认删除？',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        }, {
          text: '确认',
          handler: () => this.deleteAuthor(id)
        }
      ]
    });

    await alert.present();
  }

  formatData(data: Author[]): Author[][] {
    if (data === null) {
      return [];
    }

    let formattedData: Author[][] = [];

    this.letters.map(filter => {
      let result = data.filter(element => element.Letter === filter);

      if (result.length > 0) {
        formattedData.push(result);
      }
    });

    return formattedData;
  }

  selectAlbum() {
    this.imagePicker.getPictures({
      outputType: 1,
      quality: 50
    }).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.Avatar = 'data:image/jpg;base64,' + results[i];
      }
    }, (err) => {
      console.log(err);
    });
  }

  getAuthors() {
    this.authorService.getAuthors(this.authService.getAuthParams())
      .subscribe(async res => {
        this.authors = this.formatData(res.Data);
        await this.storage.set('authors', res.Data || []);
      });
  }

  async getAuthorById(id: string): Promise<Author> {
    const authors = await this.storage.get('authors');
    
    return authors.filter(author => author.Id == id)[0];
  }

  async handleEdit(id: string) {
    const author = await this.getAuthorById(id);

    this.Id = author.Id;
    this.Name = author.Name;
    this.CountryId = author.CountryId;
    this.Avatar = author.Avatar;
    this.Letter = author.Letter;
    this.setIsOpen(true);
  }

  handleDelete(id: number) {
    this.bookService.countBooksByType(this.authService.getAuthParams(), 'author', id)
      .subscribe(res => {
        if (res.Data) {
          this.presentDeleteTipAlert();
        } else {
          this.presentDeleteAlert(id);
        }
      });
  }

  saveAuthor() {
    const formData = new FormData();

    formData.append('name', this.Name);
    formData.append('countryId', String(this.CountryId));
    formData.append('avatar', this.Avatar);
    formData.append('letter', this.Letter);
    
    if (this.Id) {
      formData.append('id', String(this.Id));
      this.authorService.updateAuthor(this.authService.getAuthParams(), formData)
        .subscribe(() => {
          this.getAuthors();
          this.setIsOpen(false);
        });
    } else {
      this.authorService.saveAuthor(this.authService.getAuthParams(), formData)
        .subscribe(() => {
          this.getAuthors();
          this.setIsOpen(false);
        });
    }
  }

  deleteAuthor(id: number) {
    const params = this.authService.expandAuthParams({ id });

    this.authorService.deleteAuthor(params).subscribe(() => this.getAuthors());
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async ionViewWillEnter() {
    this.authService = new AuthService(await this.storage.get('token'));
  }

  async ionViewDidEnter() {
    this.authors = this.formatData(await this.storage.get('authors'));
    this.countries = await this.storage.get('countries');
  }
}
