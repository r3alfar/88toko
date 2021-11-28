import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import firebase from 'firebase/app';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ComponentService } from 'src/app/services/component.service';
import { Router } from '@angular/router';
import { identifierName } from '@angular/compiler';

@Component({
  selector: 'app-b-signup',
  templateUrl: './b-signup.page.html',
  styleUrls: ['./b-signup.page.scss'],
})
export class BSignupPage implements OnInit {

  constructor(
    private authService: AuthService,
    private compService: ComponentService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async onSubmit(form: NgForm): Promise<void> {
    await this.compService.showLoading();

    const bemail = form.value.email.toString();
    const bpassword = form.value.password.toString();
    const busername = form.value.username.toString();
    const bname = form.value.name.toString();
    const balamat = form.value.alamat.toString();

    //kumpul kedalam satu model
    const profile: any = {
      email: bemail,
      imageUrl: 'https://i.ibb.co/NYR2CH5/image.png',
      name: bname,
      username: busername,
      alamat: balamat
    };

    try {
      const UserCredential: firebase.auth.UserCredential
        = await this.authService.signUp(bemail, bpassword, profile);
      this.authService.userId = UserCredential.user.uid;
      await this.compService.hideLoading();
      await this.router.navigateByUrl('/tabs/home');
    }
    catch (error) {
      await this.compService.hideLoading();
      await this.compService.handleError(error);
    }
  }

}
