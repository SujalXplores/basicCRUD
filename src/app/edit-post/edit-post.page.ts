import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {

  post = {} as Post;
  id: any;
  constructor(
    private _act_route: ActivatedRoute,
    private _toastCtrl: ToastController,
    private _loadingCtrl: LoadingController,
    private _navCtrl: NavController,
    private _fireStore: AngularFirestore
  ) {
    this.id = this._act_route.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getPostById(this.id);
  }

  async getPostById(id: string) {
    let loader = this._loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();
    this._fireStore.doc("posts/" + id).valueChanges().subscribe(data=>{
      this.post.title = data["title"];
      this.post.details = data["details"];
    });
    (await loader).dismiss();
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

  async editPost(post: Post) {
    if (this.formValidation()) {
      let loader = this._loadingCtrl.create({
        message: "Updating..."
      });
      (await loader).present();
      try {
        await this._fireStore.doc("posts/" + this.id).update(post);
      } catch (e) {
        this.showToast(e);
      }
      (await loader).dismiss();
      this._navCtrl.navigateRoot("home");
    }
  }
}
