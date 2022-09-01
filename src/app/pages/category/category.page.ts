import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/auth.service';
import { Category } from 'src/app/interfaces/category';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  constructor(
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private router: Router,
    private storage: Storage,
    private bookService: BookService,
    private categoryService: CategoryService
  ) { }

  authService: AuthService;
  isOpenModal: boolean = false;
  categories: Category[] = [];

  Id: string = '';
  Title: string = '';

  setIsOpenModal(value: boolean) {
    this.isOpenModal = value;

    if (!value) {
      this.Id = '';
      this.Title = '';
    }
  }

  handleView() {
    this.router.navigate(['/list', 'category', this.Id]);
  }

  handleEdit() {
    const result = this.categories.filter(category => category.Id.toString() == this.Id);

    this.Id = this.Id;
    this.Title = result[0].Title;
    this.setIsOpenModal(true);
  }

  handleDelete() {
    this.bookService.countBooksByType(this.authService.getAuthParams(), 'category', parseInt(this.Id))
      .subscribe(res => {
        if (res.Data) {
          this.presentDeleteTipAlert();
        } else {
          this.presentDeleteAlert();
        }
      });
  }

  async presentActionSheet(id: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: '查看',
        icon: 'enter-outline',
        handler: () => this.handleView()
      }, {
        text: '编辑',
        icon: 'pencil-outline',
        handler: () => this.handleEdit()
      }, {
        text: '删除',
        icon: 'trash-outline',
        handler: () => this.handleDelete()
      }, {
        text: '取消',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          this.Id = '';
          this.Title = '';
        }
      }]
    });

    await actionSheet.present();
    this.Id = id;
  }

  async presentDeleteTipAlert() {
    const alert = await this.alertCtrl.create({
      header: '删除提示',
      subHeader: '分类中尚存图书，无法删除！',
      buttons: [
        {
          text: '确认',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async presentDeleteAlert() {
    const alert = await this.alertCtrl.create({
      header: '确认删除？',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        }, {
          text: '确认',
          handler: () => this.deleteCategories()
        }
      ]
    });

    await alert.present();
  }

  getCategories() {
    this.categoryService.getCategories(this.authService.getAuthParams())
      .subscribe(async res => {
        this.categories = res.Data || [];
        await this.storage.set('categories', res.Data || []);
      });
  }

  saveCategory() {
    const formData = new FormData();

    formData.append('title', this.Title);

    if (this.Id) {
      formData.append('id', this.Id);
      this.categoryService.updateCategory(this.authService.getAuthParams(), formData)
        .subscribe(() => {
          this.getCategories();
          this.setIsOpenModal(false);
        });
    } else {
      this.categoryService.saveCategory(this.authService.getAuthParams(), formData)
        .subscribe(() => {
          this.getCategories();
          this.setIsOpenModal(false);
        });
    }
  }

  deleteCategories() {
    const params = this.authService.expandAuthParams({ ids: this.Id });
    
    this.categoryService.deleteCategories(params).subscribe(() => {
      this.getCategories();
    });
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async ionViewWillEnter() {
    this.authService = new AuthService(await this.storage.get('token'));
  }

  async ionViewDidEnter() {
    this.categories = await this.storage.get('categories');
  }
}
