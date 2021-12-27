import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Profile } from 'src/app/models/profile.model';
import { ProfilService } from 'src/app/services/profil.service';

@Component({
  selector: 'app-tambahproduk',
  templateUrl: './tambahproduk.page.html',
  styleUrls: ['./tambahproduk.page.scss'],
})
export class TambahprodukPage implements OnInit {

  mainCategories: Category[];
  allSubCategories: Category[];
  selectedSubCat: Category[];
  profile: Profile;

  maincat: any;

  constructor(
    private modalCtrl: ModalController,
    private catServ: CategoryService,
    private authServ: AuthService,
    private profileServ: ProfilService
  ) { }

  async ngOnInit() {
    await this.loadUser();
    await this.loadCategories();
  }

  loadUser() {
    return new Promise<void>((resolve) => {
      this.authServ.userDetails().subscribe(res => {
        if (res === null) {
          this.profile = undefined;
        }
        else {
          this.profileServ.getProfile(this.authServ.getuid().toString()).valueChanges()
            .subscribe(data => {
              this.profile = data;
            });
        }
      });
      resolve();
    })

  }

  loadCategories() {
    return new Promise<void>((resolve) => {
      this.catServ.getAll().snapshotChanges().pipe(
        map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
      ).subscribe(data => {
        this.mainCategories = data.filter(item => item.parentId === 0);
        this.allSubCategories = data.filter(item => item.parentId !== 0);
      });
      resolve();
    })

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
