import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-additem-modal',
  templateUrl: './additem-modal.component.html',
  styleUrls: ['./additem-modal.component.scss'],
})
export class AdditemModalComponent implements OnInit {

  mainCategories: Category[];
  allSubCategories: Category[];
  selectedSubCat: Category[];

  maincat: any;

  constructor(
    private modalCtrl: ModalController,
    private catServ: CategoryService
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.catServ.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.mainCategories = data.filter(item => item.parentId === 0);
      this.allSubCategories = data.filter(item => item.parentId !== 0);
    });
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  setSubCategory(maincat) {
    this.selectedSubCat = this.allSubCategories.filter(item => item.parentId === maincat.key);
  }

  onSubmit(form: NgForm) {
    const kategori = form.value.mainCategory;
    const subkategori = form.value.subCategory;
    console.log("kategori : " + kategori + "... subkategori : " + subkategori);
  }

}
