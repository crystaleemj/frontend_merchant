import { Component } from '@angular/core';
import { CommonService } from '../service/common.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private _storage: Storage | null = null;

  constructor(private commonService: CommonService, private storage: Storage, private router:Router) {
    this.init()
    this.loadMerchantData()
  }

  isModalOpen = true;
  isSignUpPage = false;
  isSupportOpen = false;

  loginUsername = ''
  loginPassword = ''

  registerUsername = ''
  registerPassword = ''
  registerConfirmPassword = ''
  registerEmail = ''

  supportSubject = ''
  supportMessage = ''

  merchantData = []
  currentCategory = 0

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this._storage.get("userId").then((value) => {
      if (value != null && value != "") {
        this.isModalOpen = false;
      }
    })
  }

  loadMerchantData(){
    this.commonService.getAllMerchants().subscribe((res)=>{
      console.log(res)
      this.merchantData = res;
    })
  }

  merchantClick(merchantId: number){
    for(let i=0;i<this.merchantData.length;i++){
      if(this.merchantData[i]['merchantId'] == merchantId){
        this.router.navigate(['/merchant', this.merchantData[i]])
        console.log(this.merchantData[i]);
      }
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  setSignUpPageShow(isSignUp: boolean) {
    this.isSignUpPage = isSignUp;

    //Reset values when changing between login page and signup page
    this.loginUsername = ''
    this.loginPassword = ''
    this.registerUsername = ''
    this.registerPassword = ''
    this.registerConfirmPassword = ''
    this.registerEmail = ''
  }

  setSupportShow(isOpen: boolean) {
    this.supportSubject = '';
    this.supportMessage = '';
    this.isSupportOpen = isOpen;
  }

  login() {
    this.commonService.loginUser(this.loginUsername).subscribe((res) => {
      if (res != null) {
        console.log(res)
        if (res.password == this.loginPassword) {
          this.storage.set("userId", res.user_id)
          this.isModalOpen = false;
        }
      }
    })
  }

  signup() {
    if (this.registerConfirmPassword == this.registerPassword) {
      this.commonService.signUpUser(this.registerUsername, this.registerPassword, this.registerEmail).subscribe((res) => {
        if (res.msg == "Successful") {
          this.isSignUpPage = false;
        }
      })
    }
  }

  support() {
    this.setSupportShow(false);
  }

}
