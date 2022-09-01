import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  constructor(
    private router: Router,
    private storage: Storage,
    private userService: UserService
  ) { }

  authService: AuthService;
  user: User;

  getUser() {
    this.userService.getUserById(this.authService.getAuthParams())
      .subscribe(async res => {
        this.user = res.Data;
        await this.storage.set('user', res.Data);
      });
  }

  async signOut() {
    await this.storage.clear().finally(() => this.router.navigate(['/signin']));
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async ionViewWillEnter() {
    this.authService = new AuthService(await this.storage.get('token'));
    this.getUser();
  }
}
