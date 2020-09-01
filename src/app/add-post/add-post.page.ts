import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {

  post = {} as Post;
  profileEmail: string;
  constructor(
    private _toastCtrl: ToastController,
    private _loadingCtrl: LoadingController,
    private _navCtrl: NavController,
    private _fireStore: AngularFirestore,
    private _afAuth: AngularFireAuth
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
        var user = this._afAuth.currentUser;
        if (user != null) {
          (await user).providerData.forEach(profile => {
            this.profileEmail = profile.email;
            let obj={
              title: post.title,
              details: post.details,
              user_email: this.profileEmail
            }
            this._fireStore.collection("posts").add(obj);
          });
        }
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
