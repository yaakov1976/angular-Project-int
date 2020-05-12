import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AddressService } from '../address.service';
import { HttpClient } from "@angular/common/http"; 
import { City } from '../city';
import { CommonService } from 'src/app/common.service';
import { StreetObject } from '../street-object';
import { AddressOderObject } from '../address-oder-object';
import { Streets } from '../streets';

@Component({
  selector: 'app-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.css']
})
export class UsersDataComponent implements OnInit {
  constructor(private auth:AuthService, private router:Router, private address:AddressService,
    private httpClient: HttpClient,private commonService: CommonService ) { }
    mySelect = '2';
    mySelectStreet = '2';
    selectedCity:string;
    selectedStreet:string;
    houseNumber:number;
  namesOfCites:City[];
  ifYouSelectedCity:boolean=false;
  ifYouSelectedStreet:boolean=false;
  nameOfStreets:any;
  theStreets:Streets;
  newStreets:StreetObject[]=[];
  newName:string=localStorage.getItem('name');
  addressOfOder:AddressOderObject={
    city:'',
    street:'',
    houseNumber:0
  }; 
  selectChange() {
    this.selectedCity = this.commonService.getDropDownText(this.mySelect, this.namesOfCites)[0].name;
    this.ifYouSelectedCity=true;
    this.getStreet();
  }

  selectChangeStreet(){
    this.selectedStreet = this.commonService.getDropDownStreet(this.mySelectStreet, this.newStreets)[0].street_name;
    this.ifYouSelectedStreet=true;
  }
  getCity(){
    this.address.getTheCity().subscribe(cityData =>{
      this.namesOfCites=cityData;
    });
  }
  getStreet(){
    this.httpClient.get("assets/streets.json").subscribe(data =>{
      this.nameOfStreets=data;
      console.log(this.theStreets);
      let counter=0;
      this.nameOfStreets.streets.forEach( element =>{
        if(element.city_name==this.selectedCity){
          this.newStreets[counter]=element;
          counter++;
        }
      })
    })
  }
  getAddressOfOder(houseNumber){
    this.houseNumber=houseNumber;
    this.addressOfOder.city=this.selectedCity;
    this.addressOfOder.street=this.selectedStreet;
    this.addressOfOder.houseNumber=this.houseNumber;
    localStorage.setItem('address', JSON.stringify(this.addressOfOder));
  }
  logout(){
    this.auth.googleLogoout().then(res => {
      this.router.navigate(['login'])
    }).catch(err => console.log(err))
  }
  ngOnInit(): void {
    this.getCity();
    
  }
  
}
