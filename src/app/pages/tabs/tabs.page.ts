import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ProfilService } from 'src/app/services/profil.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  selectedTab: any;
  @ViewChild('tabs', { static: false }) tabs: IonTabs;

  profile: Profile;
  constructor(
    private authServ: AuthService,
    private profileServ: ProfilService
  ) { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
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
  }

  setSelectedTab() {
    this.selectedTab = this.tabs.getSelected();
    // console.log(this.selectedTab);
  }
}
