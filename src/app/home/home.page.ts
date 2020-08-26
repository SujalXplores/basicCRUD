import { Component } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

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
    private _fireStore: AngularFirestore
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
}
