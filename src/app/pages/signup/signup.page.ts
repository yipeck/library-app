import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  constructor(
    public toastCtrl: ToastController,
    private userService: UserService
  ) { }

  Email = '';
  Password = '';
  ConfirmPwd = '';

  isEmailOkay = false;
  isPasswordOkay = false;

  signUp() {
    const formData = new FormData();

    formData.append('email', this.Email);
    formData.append('password', this.Password);
    
    this.userService.signUp(formData).subscribe(async res => {
      let message = '';

      if (res.Success) {
        message = '恭喜您，成功建馆！';
      } else {
        message = '抱歉，建馆失败，请稍后再试！';
      }

      const toast = await this.toastCtrl.create({
        position: 'top',
        message: message,
        duration: 1000
      });

      toast.present();
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
      if (!res.Success && res.Message === '') {
        this.isEmailOkay = true;

        return;
      }

      let message = '';

      if (res.Message !== '') {
        message = '服务器报错，请稍后再试！';
      } else if (res.Success) {
        message = '该用户已存在！';
      }

      this.isEmailOkay = false;

      const toast = await this.toastCtrl.create({
        position: 'top',
        message: message,
        duration: 1000
      });

      toast.present();
    });
  }

  isPasswordEqual() {
    if (this.Password === this.ConfirmPwd &&
      this.ConfirmPwd.length !== 0) {
      this.isPasswordOkay = true;
    } else {
      this.isPasswordOkay = false;
    }
  }

  ngOnInit() {}

  ionViewWillLeave() {
    this.Email = '';
    this.Password = '';
    this.ConfirmPwd = '';
  }
}
