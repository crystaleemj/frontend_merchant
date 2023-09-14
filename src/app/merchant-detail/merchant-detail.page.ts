import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../service/common.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-merchant-detail',
  templateUrl: './merchant-detail.page.html',
  styleUrls: ['./merchant-detail.page.scss'],
})
export class MerchantDetailPage implements OnInit {
  private _storage: Storage | null = null;
  merchantData: any
  reviewData: any
  avgRating: number = 0.0
  isModalOpen = false

  formRating = 0.0
  formFeedback = ""
  formFile: File | undefined

  constructor(private activatedRoute: ActivatedRoute, private location: Location, private commonService: CommonService, private storage: Storage) {
    this.init()
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.merchantData = params;
      this.loadReviews(this.merchantData['merchantId'])
    })
  }

  loadReviews(merchantId: number) {
    this.commonService.loadAllReviews(merchantId).subscribe((res) => {
      if (res != null && res != "") {
        this.reviewData = res;
        let ratingCount = 0
        for (let review of this.reviewData) {
          this.avgRating += review['rating']
          ratingCount += 1
        }
        this.avgRating = parseFloat((this.avgRating / ratingCount).toFixed(1))
      }
    })
  }

  backButton() {
    this.location.back()
  }

  submit() {
    if (this._storage != null) {
      this._storage.get("userId").then((value) => {
        if (value != null && value != "") {
          if (this.formFile != undefined) {
            this.commonService.createReview(this.formFile, this.merchantData['merchantId'], value, this.formFeedback, this.formRating).subscribe((res) => {
              if (res.msg == "Successful") {
                this.isModalOpen = false;
                this.location.back();
              }
            })
          }
        }
      })
    }
  }

  rangeChange() {
    console.log(this.formRating)
  }

  fileSelected(event: any) {
    this.formFile = event.target.files[0]
  }
}
