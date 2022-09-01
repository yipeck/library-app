import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private storage: Storage,
  ) {}

  async ngOnInit() {
    await this.storage.create();
    
    const token = await this.storage.get('token');

    if (!token) {
      this.router.navigate(['/signin']);

      return;
    }
  }
}
