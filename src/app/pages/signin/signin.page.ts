import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/auth.service';
import { AuthorService } from 'src/app/services/author.service';
import { CategoryService } from 'src/app/services/category.service';
import { CountryService } from 'src/app/services/country.service';
import { PublisherService } from 'src/app/services/publisher.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  constructor(
    public toastCtrl: ToastController,
    private router: Router,
    private storage: Storage,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private countryService: CountryService,
    private publisherService: PublisherService,
    private userService: UserService
  ) { }

  authService: AuthService;
  Email: string = '';
  Password: string = '';

  isEmailOkay: boolean = false;
  isPasswordOkay: boolean = false;

  signIn() {
    const formData = new FormData();

    formData.append('email', this.Email);
    formData.append('password', this.Password);
    
    this.userService.signIn(formData).subscribe(async res => {
      let message: string;

      if (res.Success) {
        message = '恭喜您，入馆成功！';
        await this.storage.set('token', res.Token);
        this.authService = new AuthService(res.Token);
        this.getAuthors();
        this.getCategories();
        this.getCountries();
        this.getPublishers();
      } else {
        message = '抱歉，入馆失败！';
      }

      const toast = await this.toastCtrl.create({
        position: 'top',
        message: message,
        duration: 1000
      });

      toast.present();
      this.router.navigate(['/tabs/home']);
    });
  }

  isExist() {
    if (this.Email === '') {
      this.isEmailOkay = false;

      return;
    }

    const formData = new FormData();

    formData.append('email', this.Email);
    this.userService.isExist(formData).subscribe(async res => {
      if (res.Success) {
        this.isEmailOkay = true;

        return;
      } else {
        this.isEmailOkay = false;

        const toast = await this.toastCtrl.create({
          position: 'top',
          message: '该用户不存在！',
          duration: 1000
        });

        toast.present();
      }
    });
  }

  isPasswordEmpty() {
    if (this.Password.length > 0) {
      this.isPasswordOkay = true;
    } else {
      this.isPasswordOkay = false;
    }
  }

  getAuthors() {
    this.authorService.getAuthors(this.authService.getAuthParams())
      .subscribe(async res => {
        await this.storage.set('authors', res.Data || []);
      });
  }

  getCategories() {
    this.categoryService.getCategories(this.authService.getAuthParams())
      .subscribe(async res => {
        await this.storage.set('categories', res.Data || []);
      });
  }

  getCountries() {
    this.countryService.getCountries(this.authService.getAuthParams())
      .subscribe(async res => {
        await this.storage.set('countries', res.Data || []);
      });
  }
  
  getPublishers() {
    this.publisherService.getPublishers(this.authService.getAuthParams())
      .subscribe(async res => {
        await this.storage.set('publishers', res.Data || []);
      });
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async ionViewWillEnter() {
    const token = await this.storage.get('token');

    if (token) {
      this.router.navigate(['/tabs/home']);
    }
  }

  ionViewWillLeave() {
    this.Email = '';
    this.Password = '';
  }
}
