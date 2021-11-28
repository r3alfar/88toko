import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  public loading: HTMLIonLoadingElement;
  isLoading = false;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) { }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color: 'success',
    });
    await toast.present();
  }

  async showLoading(message?: string) {
    this.isLoading = true;
    this.loadingCtrl.create({
      message: message ? message : 'Please wait...'
    }).then(loader => {
      loader.present().then(() => {
        if (!this.isLoading) {
          loader.dismiss();
        }
      });
    });
  }

  async hideLoading() {
    this.isLoading = false;
    this.loadingCtrl.getTop().then(loader => {
      if (loader) {
        loader.dismiss();
      }
    });
  }

  async handleError(error): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: error.message,
      buttons: [{ text: 'Ok', role: 'cancel' }]
    });
    await alert.present();
  }
}
