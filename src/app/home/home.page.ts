import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  posts: any;
  constructor(
    private _toastCtrl: ToastController,
    private _loadingCtrl: LoadingController,
    private _fireStore: AngularFirestore,
    private _firebaseAuth: AngularFireAuth,
    private _navCtrl: NavController,
    private _alertController: AlertController
  ) { }

  ionViewWillEnter() {
    this.getPosts();
  }

  async getPosts() {
    let loader = this._loadingCtrl.create({
      message: "Fetching Posts..."
    });
    (await loader).present();

    try {
      this._fireStore.collection("posts").snapshotChanges().subscribe(data => {
        this.posts = data.map(e => {
          return {
            id: e.payload.doc.id,
            title: e.payload.doc.data()["title"],
            details: e.payload.doc.data()["details"]
          }
        })
      });
    } catch (e) {
      this.showToast(e);
    }
    (await loader).dismiss();
  }

  showToast(message: string) {
    this._toastCtrl.create({
      message: message,
      duration: 3000,
      buttons: [
        {
          side: 'start',
          icon: 'information-circle-outline',
        }
      ]
    }).then(toastData => toastData.present());
  }

  async deletePost(id: string) {
    let loader = this._loadingCtrl.create({
      message: "Deleting..."
    });
    (await loader).present();
    try {
      await this._fireStore.doc("posts/" + id).delete();
    } catch (e) {
      this.showToast(e);
    }
    (await loader).dismiss();
  }

  async presentAlertConfirm() {
    const alert = await this._alertController.create({
      header: 'Confirm',
      message: 'Are you sure to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Logout',
          handler: () => {
            this._firebaseAuth.signOut().then(data=>{
              this._navCtrl.navigateRoot("login");
            });
          }
        }
      ]
    });
    await alert.present();
  }
}
