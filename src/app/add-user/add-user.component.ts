import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { LoginService } from '../services/login.service';
import * as moment from 'moment';
declare var $;
@Component({
	selector: 'app-add-user',
	templateUrl: './add-user.component.html',
	styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
	myForm:FormGroup;
	allData = [];
	userInfo:any;
	show:boolean = false;
	password:any;
	typeFlag:boolean = false;
	allUserData:any;
	currentMonthLogs:any;

	constructor(
		public _userService: UserService,
		public _router: Router,
		public _route: ActivatedRoute,
		public _fb: FormBuilder,	
		public _loginService: LoginService
		) {	
		var branchName = localStorage.getItem('branchSelected');
		$(document).ready(function(){
			if(branchName == 'rajkot'){
				$("#rajkot").addClass( "active");
				$("#ahemdabad").removeClass("active");
			}else{
				console.log("hey");
				$("#ahemdabad").addClass("active");
				$("#rajkot").removeClass("active");
			}
		});

		this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
		console.log("the edit component data is:", this.userInfo);
		this.myForm = new FormGroup({
			userRole: new FormControl('', [Validators.required]),
			branch: new FormControl('', [Validators.required]),
			designation: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required]),
			name: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
		});
	}

	ngOnInit() {
		this.password = 'password';
	}

	onClick() {
		if (this.password === 'password') {
			this.password = 'text';
			this.show = true;
		} else {
			this.password = 'password';
			this.show = false;
		}
	}	

	getType(event){
		console.log(event.target.value);
		this.typeFlag = (event.target.value == 'Admin') ? true : false
		this.myForm.patchValue({
			userRole : event.target.value
		});
		this.myForm.get('userRole').updateValueAndValidity();
		console.log(this.myForm.value);
	}

	getBranch(event){
		console.log(event.target.value);
		this.typeFlag = (event.target.value == 'Rajkot') ? true : false
		this.myForm.patchValue({
			branch : event.target.value
		});
		this.myForm.get('branch').updateValueAndValidity();
		console.log(this.myForm.value);
	}

	addUser(value){
		var formData = new FormData();
		formData.append("userRole", this.myForm.value.userRole);
		formData.append("branch", this.myForm.value.branch);
		formData.append("designation", this.myForm.value.designation);
		formData.append("email", this.myForm.value.email);
		formData.append("name", this.myForm.value.name);
		formData.append("password", this.myForm.value.password);
		console.log("formData ======>", formData);
		console.log(this.myForm.value);

		this._userService.adminAddEmployee(this.myForm.value).subscribe((res) =>{
			console.log("the add allUser is : ", res);
			this.allUserData = this.allData.push(res);
			this._router.navigate(['']);
		},(err) => {
			console.log("the err is : ", err);
		});
	}

	logout() {
		console.log("logiut called");
		this._loginService.logout();
		this._router.navigate(['login']);
	}

	branchSelector(branchName){
		console.log(branchName);
		localStorage.setItem('branchSelected' , branchName);
		// this.currentMonthLogs  = null;
		this.ngOnInit();
		// console.log("Branch name =====> " , localStorage.getItem('branchSelected'));
	}
}
