import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerService } from '../../../services/customer.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  formSignUp: FormGroup;
  customerSession: CustomerLoginSession;
  submitted = false;

  constructor(private router: Router, private store: Store<CustomerLoginSession>,
    private customerService: CustomerService,
    private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.customerSession = clsd;
          this.spinnerService.hide();
          if (this.customerSession.IsAccess === true && this.customerSession.UserId !== 0) {
            this.router.navigate(['/']);
          } else if (this.customerSession.ErrorMessage !== '') {
            this.toastr.error(clsd.ErrorMessage);
          }
        }
      });
  }

  ngOnInit() {
    this.formSignUp = this.formBuilder.group({
      semail: ['', [Validators.required, Validators.email]],
      spassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.formSignUp.controls; }

  onSignUp() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.formSignUp.invalid) {
      return;
    }
    this.spinnerService.show();
    const email = this.formSignUp.get('semail').value;
    const password = this.formSignUp.get('spassword').value;

    this.store.dispatch(new CustomerLogin(this.customerService.getLoginCustomerParams(email, password, 'S')));
  }

}
