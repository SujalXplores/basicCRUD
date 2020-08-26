import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {

  post= {} as Post
  constructor(
    private _toastCtrl: ToastController,
    private _loadingCtrl: LoadingController,
    private _navCtrl: NavController,
    private _fireStore: AngularFirestore
  ) { }

  ngOnInit() {
  }

  async addPost(post: Post) {
    if (this.formValidation()) {
      let loader = this._loadingCtrl.create({
        message: "Creating Post..."
      });
      (await loader).present();
      try {
        await this._fireStore.collection("posts").add(post);
      } catch (e) {
        this.showToast(e);
      }
      (await loader).dismiss();
      this._navCtrl.navigateRoot("home");
    }
  }

  formValidation() {
    if (!this.post.title) {
      this.showToast("Please Enter Title");
      return false;
    }
    if (!this.post.details) {
      this.showToast("Please Enter Details");
      return false;
    }
    return true;
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
}
