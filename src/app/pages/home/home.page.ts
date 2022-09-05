import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { format } from 'date-fns';
import { Author } from 'src/app/interfaces/author';
import { Category } from 'src/app/interfaces/category';
import { Publisher } from 'src/app/interfaces/publisher';
import { Book } from 'src/app/interfaces/book';
import { BookService } from 'src/app/services/book.service';
import { Country } from 'src/app/interfaces/country';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    public actionSheetCtrl: ActionSheetController,
    private router: Router,
    private storage: Storage,
    private barcodeScanner: BarcodeScanner,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private bookService: BookService
  ) { }

  letters = '#0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  authService: AuthService;
  isOpen = false;
  isOpenPublish = false;
  isOpenShop = false;
  authors: Author[] = [];
  categories: Category[] = [];
  countries: Country[] = [];
  publishers: Publisher[] = [];
  readingBooks: Book[] = [];
  readedBooksCount = 0;
  boughtBooks: Book[] = [];

  initDate = new Date();

  publishDate = format(this.initDate, 'yyyy-MM');
  shopDate = format(this.initDate, 'yyyy-MM-dd');

  ISBN = '';
  AuthorId = 0;
  CategoryId = 0;
  PublisherId = 0;
  Title = '';
  Picture = '';
  PublishYear = format(this.initDate, 'yyyy');
  PublishMonth = format(this.initDate, 'MM');
  ShopYear = format(this.initDate, 'yyyy');
  ShopMonth = format(this.initDate, 'MM');
  ShopDay = format(this.initDate, 'dd');
  ReadStatus = 0;
  Letter = '';

  setPublishDate() {
    const date = new Date(this.publishDate);

    this.PublishYear = format(date, 'yyyy');
    this.PublishMonth = format(date, 'MM');
    this.isOpenPublish = false;
  }

  setShopDate() {
    const date = new Date(this.shopDate);

    this.ShopYear = format(date, 'yyyy');
    this.ShopMonth = format(date, 'MM');
    this.ShopDay = format(date, 'dd');
    this.isOpenShop = false;
  }
  
  setIsOpen(value: boolean) {
    this.isOpen = value;

    if (!value) {
      this.ISBN = '';
      this.AuthorId = 0;
      this.CategoryId = 0;
      this.PublisherId = 0;
      this.Title = '';
      this.Picture = '';
      this.PublishYear = format(this.initDate, 'yyyy');
      this.PublishMonth = format(this.initDate, 'MM');
      this.ShopYear = format(this.initDate, 'yyyy');
      this.ShopMonth = format(this.initDate, 'MM');
      this.ShopDay = format(this.initDate, 'dd');
      this.ReadStatus = 0;
      this.Letter = '';
    }
  }

  setIsOpenPublish(value: boolean) {
    this.isOpenPublish = value;
  }

  setIsOpenShop(value: boolean) {
    this.isOpenShop = value;
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      this.Picture = 'data:image/jpg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  selectAlbum() {
    this.imagePicker.getPictures({
      outputType: 1,
      quality: 50
    }).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.Picture = 'data:image/jpg;base64,' + results[i];
      }
    }, (err) => {
      console.log(err);
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: '相册选择',
        icon: 'images-outline',
        handler: () => this.selectAlbum()
      }, {
        text: '拍照',
        icon: 'camera-outline',
        handler: () => this.takePicture()
      }, {
        text: '取消',
        icon: 'close',
        role: 'cancel'
      }]
    });

    await actionSheet.present();
  }

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
    }).catch(err => {
      console.log('Error', err);
    });
  }

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

  getReadingBooks() {
    this.bookService.getBooksByType(this.authService.getAuthParams(), 'status', 0)
      .subscribe(res => this.readingBooks = res.Data || []);
  }

  countReadedBooks() {
    this.bookService.countBooksByType(this.authService.getAuthParams(), 'status', 1)
      .subscribe(res => this.readedBooksCount = res.Data || 0);
  }

  getBooksBoughtThisMonth() {
    this.bookService.getBooksBoughtThisMonth(this.authService.getAuthParams())
      .subscribe(res => this.boughtBooks = res.Data || []);
  }

  getBooks() {
    this.getReadingBooks();
    this.countReadedBooks();
    this.getBooksBoughtThisMonth();
  }

  saveBook() {
    const formData = new FormData();

    formData.append('ISBN', this.ISBN);
    formData.append('authorId', String(this.AuthorId));
    formData.append('categoryId', String(this.CategoryId));
    formData.append('publisherId', String(this.PublisherId));
    formData.append('title', this.Title);
    formData.append('picture', this.Picture);
    formData.append('publishYear', String(this.PublishYear));
    formData.append('publishMonth', String(this.PublishMonth));
    formData.append('shopYear', String(this.ShopYear));
    formData.append('shopMonth', String(this.ShopMonth));
    formData.append('shopDay', String(this.ShopDay));
    formData.append('readStatus', String(this.ReadStatus));
    formData.append('letter', this.Letter);
    
    this.bookService.saveBook(this.authService.getAuthParams(), formData)
      .subscribe(() => {
        this.setIsOpen(false);
        this.getBooks();
      });
  }

  async ngOnInit() {
    await this.storage.create();
  }
  
  async ionViewWillEnter() {
    const token = await this.storage.get('token');
    
    if (!token) {
      this.router.navigate(['/signin']);
    }

    this.authService = new AuthService(await this.storage.get('token'));
  }

  async ionViewDidEnter() {
    this.authors = await this.storage.get('authors');
    this.categories = await this.storage.get('categories');
    this.countries = await this.storage.get('countries');
    this.publishers = await this.storage.get('publishers');

    if (this.authService) {
      this.getBooks();
    }
  }
}
