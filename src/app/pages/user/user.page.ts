import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  constructor(
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private storage: Storage,
    private userService: UserService
  ) { }

  authService: AuthService;
  isAvatarOpen = false;
  isNickNameOpen = false;
  isSloganOpen = false;
  isPwdOpen = false;

  Avatar = '';
  NickName = '';
  Slogan = '';

  tempAvatar = '';
  tempNickName = '';
  tempSlogan = '';

  setIsAvatarOpen(value: boolean) {
    this.isAvatarOpen = value;
  }

  setIsNickNameOpen(value: boolean) {
    this.isNickNameOpen = value;
  }

  setIsSloganOpen(value: boolean) {
    this.isSloganOpen = value;
  }

  setIsPwdOpen(value: boolean) {
    this.isPwdOpen = value;
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      this.tempAvatar = 'data:image/jpg;base64,' + imageData;
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
        this.tempAvatar = 'data:image/jpg;base64,' + results[i];
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

  updateUser(attrName: string) {
    let attrValue = '';
    const formData = new FormData();

    switch(attrName) {
      case 'Avatar':
        attrValue = this.tempAvatar;
        break;
      case 'NickName':
        attrValue = this.tempNickName;
        break;
      case 'Slogan':
        attrValue = this.tempSlogan;
        break;
    }

    formData.append('name', attrName);
    formData.append('value', attrValue);
    
    this.userService.updateUser(this.authService.getAuthParams(), formData)
      .subscribe(res => {
        if (res.Success) {
          switch(attrName) {
            case 'Avatar':
              this.setIsAvatarOpen(false);
              break;
            case 'NickName':
              this.setIsNickNameOpen(false);
              break;
            case 'Slogan':
              this.setIsSloganOpen(false);
              break;
          }
        }
      });
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async ionViewWillEnter() {
    this.authService = new AuthService(await this.storage.get('token'));
  }

  async ionViewDidEnter() {
    const user = await this.storage.get('user');

    this.tempAvatar = user.Avatar;
    this.tempNickName = user.NickName;
    this.tempSlogan = user.Slogan;
  }
}
