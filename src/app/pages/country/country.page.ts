import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Country } from 'src/app/interfaces/country';
import { CountryService } from 'src/app/services/country.service';
import { AuthService } from 'src/app/auth.service';
import { AuthorService } from 'src/app/services/author.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.page.html',
  styleUrls: ['./country.page.scss'],
})
export class CountryPage implements OnInit {
  constructor(
    private alertCtrl: AlertController,
    private storage: Storage,
    private authorService: AuthorService,
    private countryService: CountryService
  ) { }

  authService: AuthService;
  isOpen = false;
  countries: Country[] = [];
  
  Id = '';
  Name = '';

  setIsOpen(value: boolean) {
    this.isOpen = value;

    if (!value) {
      this.Id = '';
      this.Name = '';
    }
  }

  async presentDeleteTipAlert() {
    const alert = await this.alertCtrl.create({
      header: '删除提示',
      subHeader: '籍贯已被使用，无法删除！',
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
          handler: () => this.deleteCountry(id)
        }
      ]
    });

    await alert.present();
  }

  getCountries() {
    this.countryService.getCountries(this.authService.getAuthParams())
      .subscribe(async res => {
        this.countries = res.Data;
        await this.storage.set('countries', res.Data || []);
      });
  }

  handleEdit(id: string, name: string) {
    this.Id = id;
    this.Name = name;

    this.setIsOpen(true);
  }

  handleDelete(id: number) {
    this.authorService.countByCountry(this.authService.getAuthParams(), id)
      .subscribe(res => {
        if (res.Data) {
          this.presentDeleteTipAlert();
        } else {
          this.presentDeleteAlert(id);
        }
      });
  }

  saveCountry() {
    const formData = new FormData();

    formData.append('name', this.Name);

    if (this.Id) {
      formData.append('id', this.Id);
      this.countryService.updateCountry(this.authService.getAuthParams(), formData)
        .subscribe(() => {
          this.getCountries();
          this.setIsOpen(false);
        });
    } else {
      this.countryService.saveCountry(this.authService.getAuthParams(), formData)
        .subscribe(() => {
          this.getCountries();
          this.setIsOpen(false);
        });
    }
  }

  deleteCountry(id: number) {
    const params = this.authService.expandAuthParams({ id });

    this.countryService.deleteCountry(params).subscribe(() => this.getCountries());
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async ionViewWillEnter() {
    this.authService = new AuthService(await this.storage.get('token'));
  }

  async ionViewDidEnter() {
    this.countries = await this.storage.get('countries');
  }
}
