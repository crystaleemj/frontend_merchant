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

  constructor(private commonService: CommonService, private storage: Storage, private router: Router) {
    this.init()
    this.loadMerchantData()
  }

  isNavbarCollapsed = true;

  isModalOpen = true;
  isSignUpPage = 'login';
  isSupportOpen = false;

  loginUsername = ''
  loginPassword = ''

  registerUsername = ''
  registerPassword = ''
  registerConfirmPassword = ''
  registerEmail = ''

  forgotUsername = ''

  supportSubject = ''
  supportMessage = ''

  resetPassword = ''
  resetConfirmPassword = ''

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

  loadMerchantData() {
    this.commonService.getAllMerchants().subscribe((res) => {
      console.log(res)
      this.merchantData = res;
    })
  }

  merchantClick(merchantId: number) {
    for (let i = 0; i < this.merchantData.length; i++) {
      if (this.merchantData[i]['merchantId'] == merchantId) {
        this.router.navigate(['/merchant', this.merchantData[i]])
        console.log(this.merchantData[i]);
      }
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  setSignUpPageShow() {
    this.isSignUpPage = 'signup';

    //Reset values when changing between login page and signup page
    this.loginUsername = ''
    this.loginPassword = ''
    this.registerUsername = ''
    this.registerPassword = ''
    this.registerConfirmPassword = ''
    this.registerEmail = ''
  }

  setForgotPasswordShow() {
    this.isSignUpPage = 'forgotpassword';
  }

  setSupportShow(isOpen: boolean) {
    this.supportSubject = '';
    this.supportMessage = '';
    this.isSupportOpen = isOpen;
  }

  login() {
    this.commonService.loginUser(this.loginUsername, this.loginPassword).subscribe((res) => {
      if (res != null) {
        this.storage.set("userId", res.user_id)
        if (res.reset == 0) {
          this.isModalOpen = false;
        }
        else {
          this.isSignUpPage = 'reset';
        }
      }
    })
  }

  signup() {
    if (this.registerConfirmPassword == this.registerPassword) {
      this.commonService.signUpUser(this.registerUsername, this.registerPassword, this.registerEmail).subscribe((res) => {
        if (res.msg == "Successful") {
          this.isSignUpPage = 'login';
        }
      })
    }
  }

  support() {
    this.storage.get("userId").then((value) => {
      this.commonService.supportRequest(value, this.supportSubject, this.supportMessage).subscribe((res => {
        if (res.msg == "Successful") {
          this.setSupportShow(false);
        }
      }))
    })
  }

  forgotpassword() {
    this.isSignUpPage = 'forgotstep2';
  }

  confirmNewPassword() {
    this.storage.get("userId").then((value) => {
      if (this.resetPassword == this.resetConfirmPassword) {
        this.commonService.resetUser(value, this.resetPassword).subscribe((res => {
          if (res.msg == "Successful") {
            this.isModalOpen = false;
          }
        }))
      }
    })


  }

}
