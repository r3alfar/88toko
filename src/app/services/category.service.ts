import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  //private dbPath = '/categories';
  //categoryRef: AngularFireList<Category> = null;

  constructor(
    private db: AngularFireDatabase
  ) { }

  // getAllCategories(): AngularFireList<Category> {
  //   return this.db.list(`categories/`, ref => ref.orderByChild("parentId").equalTo(0));
  // }

  // getAllCatSubCategories(catKey: string): AngularFireList<Category> {
  //   return this.db.list(`categories/`, ref => ref.orderByChild("parentId").equalTo(catKey));
  // }

  getAll(): AngularFireList<Category> {
    return this.db.list(`categories/`);
  }


  // getAllCategories(where?: string[]): AngularFireList<Category> {
  //   if (where === undefined) {
  //     return this.db.list(`categories/`);
  //   }
  //   return this.db.list(`categories/`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
  // }

  // getCategory(key: string): AngularFireObject<Category> {
  //   return this.db.object(`categories/${key}`);
  // }

  // getAllSubcatFromCat(catKey: string): AngularFireList<SubCategory> {
  //   return this.db.list(`categories/${catKey}/`, ref => ref.orderByChild('name'));
  // }

}
