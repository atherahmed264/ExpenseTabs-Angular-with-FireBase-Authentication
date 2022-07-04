import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../Services/auth.service';
import { Expense } from '../Services/expense.model';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor( private service:Auth ,private route:Router) { }

  user!:any;
  reason!:String;
  amount!:any;
  date!:any;

  add:boolean = false;
  items!:{}[];
  username!:any;
  expenseList!:Expense[];
  displayName!:any;
  dummy:any;
  loader:boolean = false;

  dataDisplay:any=[];
  datesList:any = [];
  sett:any =[];

  ngOnInit(): void {
    this.service.user$.subscribe( res => this.user=res);
    if (sessionStorage.getItem('user')) {
      this.user = sessionStorage.getItem('user');
      console.log(this.user);
    }
    this.loader = true;
    this.loadData();
    this.loader = false;
  }

  loadData() {
    this.service.getData(this.user).subscribe({
      next: res => {
        this.loader = true;
        this.items = [];
        this.sett = [];
        this.datesList = [];
        for( let key in res){
          this.items.push(res[key]);
        }
        console.log(this.items)
        let [ a , ...b] = this.items;
        this.username = a;
        console.log(this.username);
        this.dummy = b;
        this.expenseList = this.dummy;
        this.displayName = this.username?.name;
        console.log('Expenses ==',this.expenseList);
        this.expenseList.forEach( val => {
          let date = new Date(val.date);
          let [a,month,b,year] = date.toString().split(' ');
          this.datesList.push({date:month+' '+year,values:[]});
        })
        console.log(this.datesList);
        this.sett = this.datesList.filter((val:any,i:number) => {
          let _val = JSON.stringify(val) 
          return i == this.datesList.findIndex((x:any) => {
            let str = JSON.stringify(x)
            return str == _val
          })
        })
        console.log(this.sett);
        this.expenseList.forEach( el => {
          this.sett.forEach( (vals:any) => {
            let d = new Date(el.date);
            let [a,month,b,year] = d.toString().split(' ');
            if( month+' '+year == vals.date){
              vals.values.push(el);
            }
          })
        })
        console.log(this.sett);
        this.loader = false;
      },
      error: err => {
        console.log(err.message);
        alert(err.message);
      }
    })
  }

  addExp() {
    let body:Expense = {
      amount: this.amount,
      reason: this.reason,
      date: this.date,
    }
    this.service.postData(body,this.user)
    .subscribe({
      next: res => {
        this.amount = '';
        this.reason = '';
        this.date = '';
        alert('Sucessfully Added');
        this.loadData();
      },
      error: err => alert(err.message)
    });
  }

  currencyChange() {}

  logout(){
    this.service.user$.next('');
    sessionStorage.removeItem('user');
    this.route.navigate(['']);  
  }
}
