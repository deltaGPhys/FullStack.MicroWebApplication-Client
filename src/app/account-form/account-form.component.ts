import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AccountService} from '../services/account-service';
import { Account } from '../models/account'


@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  
  account: Account;
  accountType:Account;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService) {
    }

  onSubmit() {
    this.accountService.save(this.account).subscribe(data => this.gotoAccountsList());

  }
  gotoAccountsList() {
    this.router.navigateByUrl('accounts');
  }
  ngOnInit() {
  }

}