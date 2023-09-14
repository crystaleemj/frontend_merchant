import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonService } from '../service/common.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { GoogleMap } from '@capacitor/google-maps';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private _storage: Storage | null = null;

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;

  mapZoom = 12;
  point: google.maps.LatLngLiteral = {
    lat: 1.2923210380975625,
    lng: 103.7765463514608,
  };
  mapCenter = new google.maps.LatLng(this.point);
  mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 17,
  };

  markerInfoContent = '';
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP,
  };

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
  merchantSearched = []
  currentCategory = 0

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this._storage.get("userId").then((value) => {
      if (value != null && value != "") {
        this.isModalOpen = false;
      }
    });
  }

  loadMerchantData() {
    this.commonService.getAllMerchants().subscribe((res) => {
      console.log(res)
      this.merchantData = res;
      this.merchantSearched = [...this.merchantData];
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
        console.log("Got response")
        this.storage.set("userId", res.user_id)
        console.log("setting user id and checking for reset")
        if (res.reset == 0) {
          console.log("reset 0, closing")
          this.isModalOpen = false;
        }
        else {
          console.log("resetting")
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
    if (this.forgotUsername != "") {
      this.commonService.forgotPass(this.forgotUsername).subscribe((res => {
        if (res.msg == "Successful") {
          this.isSignUpPage = "login";
        }
      }))
    }
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

  categoryChange(event:any){
    this.currentCategory = event.target.value
  }

  searchChange(event:any){
    console.log(event.target.value)
    if(event.target.value == ""){
      this.merchantSearched = [...this.merchantData]
    }
    else{
      this.merchantSearched = this.merchantData.filter((merchant:any)=>merchant['merchantName'].toLowerCase().indexOf(event.target.value.toLowerCase())>-1)
    }
  }

  logout(){
    this._storage?.set("userId", "")
    this.isModalOpen = true
  }
}
