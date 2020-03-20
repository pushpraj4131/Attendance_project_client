import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

import { UserService } from '../services/user.service';
import { LogsService }  from '../services/logs.service';
import { LoginService } from '../services/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
declare var $:any;

@Component({
	selector: 'app-user-detail',
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
	userId : any;
	totalHoursToWork :any;
	totalHoursWorked :any;
	searchForm:FormGroup;
	isDisable:boolean =false;
	userInfo : any;
	currentUserDetail : any;
	totalHoursToWorkField: any;
	fiveDaysLogs: any = [];
	p: number = 1;
	data = {
		firstDate : "",
		secondDate : "",
	};
	//imported
	modelValue;
	previousData : any;
	logs : any = [];
	flag = false;
	getLogsBySingleDate = false;
	getLogsBetweenDates = false;
	search = false;
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private _userService: UserService,
		private _logService: LogsService,
		private _loginService: LoginService,
		private http: HttpClient,
		private ngxLoader: NgxUiLoaderService
	){
		
		//ngx-ui-loader
		this.ngxLoader.start();
		this.http.get(`https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader`).subscribe((res: any) => {
			console.log(res);
			this.ngxLoader.stop();
		});
		this.userInfo  = JSON.parse(localStorage.getItem("currentUser"));
		this.userId = this.activatedRoute.snapshot.paramMap.get('id');
		console.log(this.userId);
	}

	ngOnInit() {
		this.getUserById();
		// this.getInitialRecord();
	
		var self = this;
		
		$(document).ready(function(){
				setTimeout(function(){ 
					$(function() {
						var start = moment().subtract(5, 'days');
						var end = moment();

						function cb(start, end) {
							self.getRangeDate(start, end);
						}

						$('#reportrange').daterangepicker({
							startDate: start,
							endDate: end,
							ranges: {
								'Today': [moment()/*.add(1 , 'days')*/, moment()],
								'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days') ],
								'Last 7 Days': [moment().subtract(6, 'days'), moment()],
								'Last 30 Days': [moment().subtract(29, 'days'), moment()],
								'This Month': [moment().startOf('month'), moment().endOf('month')],
								'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
							}
						}, cb);

						cb(start, end);

					});
				}, 200);
			$('[data-toggle="tooltip"]').tooltip();   
		});
	
		

	}
	
	editProfile(){
		this.router.navigate(['edit-profile', this.userId]);
	}


	getUserById(){
		this._userService.getUserById(this.userId).subscribe((res) => {
			console.log("resposne of singleUser" , res); 
			this.currentUserDetail = res;
		} , (err) => {
			console.log("error of singleUser" , err); 
		});
	}
	
	deleteUser(i){
		this._userService.adminDelEmployee(this.userId).subscribe((res) => {
			console.log("the deleteUser response is:", res);
			this.router.navigate(['/all-users']);
		}, (err) => {
			console.log("the delete user err :", err);
		});
	}

	resetForm(){
		this.search = false;
		(<HTMLInputElement>document.getElementById("reportrange")).value = "";
	}
	openModel(index){
		console.log("hey" , index);
		this.modelValue = this.logs[index];
		console.log(this.modelValue);
		$('#myModal').modal('show');
	}
	getRangeDate(start, end){
		console.log(start._d, end._d , this.fiveDaysLogs)
			//ngx-ui-loader
		this.ngxLoader.start();
		this.http.get(`https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader`).subscribe((res: any) => {
			console.log(res);
			this.ngxLoader.stop();
		});	
			console.log(" date " ,new Date(start._d).toISOString() , new Date(end._d).toISOString() ,/* "=>",new Date(moment(start._d).add(1 , 'days')).toISOString()*/);
			var increseStartDate:any = moment(start._d).add(1 , 'days');
			 // new Date(moment(start._d).add(1 , 'days')).toISOString()
			var body = {
				userId : this.userId,
				startDate : new Date(increseStartDate).toISOString(),
				endDate : new Date(end._d).toISOString()
			}
			console.log("New changed ===>" , body);
			this.search = true;
			this._logService.getLogsReportById(body).subscribe((res:any)=>{
				console.log("response of getLogsReportById" , res);
				if(res.foundLogs){
					this.logs = res.foundLogs;

					this.logs.forEach((objData)=>{
						if(objData.diffrence == null){
							objData['seconds'] = 'AB';
						}
						else if(objData.diffrence == '-'){
							objData['seconds'] = 'N/A';	
						}
						else if(objData.diffrence != '-' || objData.diffrence != null){
							objData['seconds'] = moment.duration(objData.diffrence).asSeconds();
						}
					});
					console.log("ALL logs ========>", this.logs);

					this.totalHoursToWork = res.TotalHoursToComplete; 
					this.totalHoursWorked = res.TotalHoursCompleted; 
				}
				else{
					this.logs = res;
					this.totalHoursToWork = "No Log Found";
				}
			
				// this.calculateTotalDuration(this.logs , resultHours , start._d , end._d);
			} , (err)=>{
				console.log("err of getLogsReportById" , err);
			});
		
	}
	logout() {
		console.log("logiut ccalled");
		this._loginService.logout();
		this.router.navigate(['login']);
	}

	calculateTotalDuration(array , resultHours, start , end){
		var workingHours = 0;
		var totalHours = 0;
		// console.log("start ========+++>" , start._d , "end ==>" , end._d);
		if(resultHours < 1)
			resultHours = 1
		for(var i = 0 ; i< Math.ceil(resultHours) ; i++){
			console.log(resultHours - i);
			var local:any = moment(start._d).subtract(i, 'days');
			local =  moment(local._d , "YYYY-MM-DD HH:mm:ss").format('dddd');
			// console.log("add date ====>" , moment(start._d).subtract(i, 'days')._d  , "local ady" ,local);
			totalHours = totalHours + 30600; 
		}
		array.forEach((obj)=>{
			// console.log(obj);
			if(obj.diffrence){
				workingHours = workingHours + moment.duration(obj.diffrence).asSeconds();
				console.log("workingHours ====>" , workingHours);
			}
		});
		//calculate total working hours 
		var minutes = Math.floor(totalHours / 60);
		totalHours = totalHours%60;
		var hours = Math.floor(minutes/60)
		minutes = minutes%60;
		console.log("totalHours ====>" , hours , minutes);
		this.totalHoursToWork =  hours+":"+minutes+":"+"00";
		//calculate hours worked 
		
		var minutes = Math.floor(workingHours / 60);
		workingHours = workingHours%60;
		var hours = Math.floor(minutes/60)
		minutes = minutes%60;
		this.totalHoursWorked = hours+":"+minutes+":"+"00";
		console.log("total hours attednent ====>" , this.totalHoursToWork);
		console.log("total hours to attendnace====>" , this.totalHoursWorked);
	}
	// properFormatDate(data){
	// 	console.log("data @228 ===>" , data)
	// 	return data = data.filter((obj)=>{
	// 		// console.log("Before date =======>" , obj.date);
	// 		obj.date = moment(obj.date).utc().format("DD/MM/YYYY");
	// 		// console.log("after date =======>" , obj.date);
	// 		return obj.date;
	// 	});
	// }
	getBackGroundColorSingleEmployee(value){
		console.log("value of color" , value);
		if(typeof value != 'string'){
			if(value < 30600){
				return  '#ff686810'
			}else{
				return  '#00800010'
			}
		}else{
			if(value == 'Sunday'){
				return  '#8c8cf366'
			}else{
				return  'silver'
			}
		}
	}
	getColorSingleEmployee(value){
		console.log("VALUE +++++++++++++>", value);
		if(typeof value != 'string'){
			if(value < 30600){
				return  'red'
			}else{
				return  'green'
			}
		}else{
			if(value == 'Sunday'){
				return  'blue'
			}else{
				return  'black'
			}
		}
	}
	properFormatDate(data){
		return data = data.filter((obj)=>{
			return obj.date = moment(obj.date).utc().format("DD/MM/YYYY");

		});
	}
}
