import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Profile } from 'src/app/models/profile.model';
import { ProfilService } from 'src/app/services/profil.service';
import { ModalController, NavController } from '@ionic/angular';
import { AdditemModalComponent } from 'src/app/components/additem-modal/additem-modal.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  idUser: string;
  userData: any;
  profile: Profile;

  isEdit = false;

  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase,
    private profileServ: ProfilService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    await this.loaduser();
  }

  loaduser() {
    return new Promise<void>((resolve) => {
      this.authService.userDetails().subscribe(res => {
        if (res === null) {
          this.profile = undefined;
        }
        else {
          this.profileServ.getProfile(this.authService.getuid().toString()).valueChanges()
            .subscribe(data => {
              this.profile = data;
              console.log(this.profile);

            });
        }
      });
      resolve();
    })
  }

  getUserData() {
    this.db.object('profile/' + this.idUser).valueChanges().subscribe(data => {
      this.userData = data;
      console.log(this.userData);
    });
  }

  getIdUser() {
    this.authService.userDetails().subscribe(res => {
      if (res !== null) {
        this.idUser = res.uid;
        this.getUserData();
      }
    }, err => {
      console.log(err);
    });
  }

  onLogout() {
    this.authService.signOut()
      .then(() => {
        this.navCtrl.navigateRoot('tabs/home');
        this.profile = undefined;
      }).catch(error => {
        console.log(error);
      });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AdditemModalComponent
    });

    await modal.present();
  }

  // getUserData() {
  //   this.userServ.getProfile(this.idUser).valueChanges().subscribe(res => {
  //     this.userData = res;
  //     console.log(this.userData);
  //   });
  // }

}
