import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ComponentService } from 'src/app/services/component.service';
import firebase from 'firebase/app';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-a-signin',
  templateUrl: './a-signin.page.html',
  styleUrls: ['./a-signin.page.scss'],
})
export class ASigninPage implements OnInit {

  constructor(
    private authService: AuthService,
    private compService: ComponentService,
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  async onSubmit(form: NgForm): Promise<void> {
    await this.compService.showLoading();
    const email = form.value.email.toString();
    const password = form.value.password.toString();

    try {
      const userCredential: firebase.auth.UserCredential
        = await this.authService.signIn(email, password);
      await this.compService.hideLoading();
      //await this.router.navigate(['/', 'tabs']);
      await this.navCtrl.navigateRoot('tabs/home');
    }
    catch (error) {
      await this.compService.hideLoading();
      await this.compService.handleError(error);
    }
  }

}
