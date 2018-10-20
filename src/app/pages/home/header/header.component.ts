import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  customerSession: CustomerLoginSession;
  storeGetHomeData: any;
  cartItemCount = 0;

  constructor(private store: Store<CustomerLoginSession>) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        this.customerSession = clsd;
      });
    this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        if (pssd) {
          this.storeGetHomeData = pssd;
          this.cartItemCount = this.storeGetHomeData.CustomerInfo ?
          this.storeGetHomeData.CustomerInfo.CartItemCount : 0;
        }

      });
  }

  ngOnInit() {
  }

}
