import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'category',
        loadChildren: () => import('../pages/category/category.module').then(m => m.CategoryPageModule)
      },
      {
        path: 'author',
        loadChildren: () => import('../pages/author/author.module').then(m => m.AuthorPageModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('../pages/setting/setting.module').then(m => m.SettingPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
