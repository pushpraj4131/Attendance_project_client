import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { LoginService } from '../services/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
	editForm:FormGroup;
	passForm:FormGroup;
	edit:any;
	userInfo:any;
	show:boolean = false;
	password:any;
	userId:any;
	
	constructor(
		public _userService: UserService,
		public _router: Router,
		public _route: ActivatedRoute,
		public _fb: FormBuilder,	
		public _loginService: LoginService,
		private http: HttpClient,
		private ngxLoader: NgxUiLoaderService
		) { 
		this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
		this.userId = this._route.snapshot.paramMap.get('id');
		console.log(this.userId);
		console.log("the edit component data is:", this.userInfo);
		this.editForm = new FormGroup({
			userRole: new FormControl('', [Validators.required]),
			branch: new FormControl(null),
			designation: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required]),
			name: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
		});
		this.passForm = new FormGroup({
			oldPassword: new FormControl('', [Validators.required]),
			newPassword: new FormControl('', [Validators.required]),
			confirmPassword: new FormControl('', [Validators.required]),
		});
	}

	ngOnInit() {
		this.getEmpData();
		this.password = 'password';
		this.ngxLoader.start();
		this.http.get(`https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader`).subscribe((res: any) => {
			console.log(res);
			this.ngxLoader.stop();
		});
	}

	getEmpData(){
		this._userService.getUserById(this.userId).subscribe((res:any) => {
			this.edit = res;	
			console.log("the allDat of user response is =====>", res);
		},(err) => {
			console.log("the allData of user err is ===>", err);
		});
	}

	viewPass() {
		if (this.password === 'password') {
			this.password = 'text';
			this.show = true;
		} else {
			this.password = 'password';
			this.show = false;
		}
	}

	updateUser(){
		console.log("the all Edit data is ======>", this.edit);
		this._userService.getEditById(this.userId, this.edit).subscribe((res:any) => {
			console.log("the edit data is: =====>", res);
			this._router.navigate(['user-profile', this.userId]);

		}, (err) => {
			console.log("the edit data err is: ===>", err);
		});
	}

	updatePass(userInfo){		
		this.userInfo.password = this.passForm.value.confirmPassword;
		console.log("the edit data is: =====>", this.userInfo.password);
		this.edit = this.userInfo;
		this.passForm.reset();
	}

	logout() {
		console.log("logiut ccalled");
		this._loginService.logout();
		this._router.navigate(['login']);
	}
}
