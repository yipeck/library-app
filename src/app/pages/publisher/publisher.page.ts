import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/auth.service';
import { Publisher } from 'src/app/interfaces/publisher';
import { BookService } from 'src/app/services/book.service';
import { PublisherService } from 'src/app/services/publisher.service';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.page.html',
  styleUrls: ['./publisher.page.scss'],
})
export class PublisherPage implements OnInit {
  constructor(
    private alertCtrl: AlertController,
    private storage: Storage,
    private bookService: BookService,
    private publisherService: PublisherService
  ) { }

  authService: AuthService;
  isOpen: boolean = false;
  publishers: Publisher[] = [];

  Id: string = '';
  Name: string = '';

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
      subHeader: '出版社中尚存图书，无法删除！',
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
          handler: () => this.deletePublisher(id)
        }
      ]
    });

    await alert.present();
  }

  getPublishers() {
    this.publisherService.getPublishers(this.authService.getAuthParams())
      .subscribe(async res => {
        this.publishers = res.Data;
        await this.storage.set('publishers', res.Data || []);
      });
  }

  handleEdit(id: string, name: string) {
    this.Id = id;
    this.Name = name;

    this.setIsOpen(true);
  }

  handleDelete(id: number) {
    this.bookService.countBooksByType(this.authService.getAuthParams(), 'publisher', id)
      .subscribe(res => {
        if (res.Data) {
          this.presentDeleteTipAlert();
        } else {
          this.presentDeleteAlert(id);
        }
      });
  }

  savePublisher() {
    const formData = new FormData();

    formData.append('name', this.Name);

    if (this.Id) {
      formData.append('id', this.Id);
      this.publisherService.updatePublisher(this.authService.getAuthParams(), formData)
        .subscribe(() => {
          this.getPublishers();
          this.setIsOpen(false);
        });

    } else {
      this.publisherService.savePublisher(this.authService.getAuthParams(), formData)
        .subscribe(() => {
          this.getPublishers();
          this.setIsOpen(false);
        });
    }
  }

  deletePublisher(id: number) {
    const params = this.authService.expandAuthParams({ id })

    this.publisherService.deletePublisher(params)
      .subscribe(() => this.getPublishers());
  }

  async ngOnInit() {
    await this.storage.create();

  }

  async ionViewWillEnter() {
    this.authService = new AuthService(await this.storage.get('token'));
  }

  async ionViewDidEnter() {
    this.publishers = await this.storage.get('publishers');
  }
}
