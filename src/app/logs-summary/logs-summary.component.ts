import { Component, OnInit } from '@angular/core';
import { LogsService } from '../services/logs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipe } from '../filter.pipe';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

declare var $;

@Component({
	selector: 'app-logs-summary',
	templateUrl: './logs-summary.component.html',
	styleUrls: ['./logs-summary.component.css'],
	providers: [FilterPipe]
})
export class LogsSummaryComponent implements OnInit {
	searchData : any;
	userInfo : any;
	currentMonthLogs  ;
	currentMonthLogsCount = [] ;
	modelValue : any ;
	p: number = 1;

	//imported
	data = {
		firstDate : "",
		secondDate : "",
		name: ""
	};
	previousData : any;
	logs : any;
	flag = false;
	search:any;
	totalHoursToWork:any;
	totalHoursWorked:any;
	totalHoursToEmp:any;

	allEmployeesLogs : any = [];
	absentEmp:any = [];
	totalEmployees:any;
	constructor(public _logService: LogsService , private route: ActivatedRoute,
		private router: Router , public _loginService: LoginService , public _filterPipe: FilterPipe , private http: HttpClient,
		private ngxLoader: NgxUiLoaderService, private _userService: UserService,) { }

	ngOnInit() {
		this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
		var branchName = localStorage.getItem('branchSelected');
		var self = this;
		$(document).ready(() => {
			if(branchName == 'rajkot'){

				$("#rajkot").addClass( "active");
				$("#ahemdabad").removeClass("active");
			}else{
				console.log("hey");
				$("#ahemdabad").addClass("active");
				$("#rajkot").removeClass("active");
			}
			$(function() {

				var start = moment().startOf('month');
				var end = moment().endOf('month');

				function cb(start, end) {
					if(self.userInfo.userRole != 'admin')
						self.getRangeDate(start, end);
				}

				$('#reportrange').daterangepicker({
					startDate: start,
					endDate: end,
					ranges: {
						'Today': [moment(), moment()],
						'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
						'Last 7 Days': [moment().subtract(6, 'days'), moment()],
						'Last 30 Days': [moment().subtract(29, 'days'), moment()],
						'This Month': [moment().startOf('month'), moment().endOf('month')],
						'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
					}
				}, cb);

				cb(start, end);

			});
			$('[data-toggle="tooltip"]').tooltip();   
			

		});
		// this.getLogsCountByMonthDefault();
		
		if(this.userInfo.userRole == 'admin'){
			this.getTodaysAttendance();
			this.search = false;
			// this.page(1);
		}

		//ngx-ui-loader
		this.ngxLoader.start();
		this.http.get(`https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader`).subscribe((res: any) => {
			console.log(res);
			this.ngxLoader.stop();
		});
	}
	// ADMIN FUNCTION
	getLogsCountByMonthDefault(){
		this._logService.getLogsCountByMonthDefault().subscribe((response: any) => {
			// this.currentMonthLogs = response;
			console.log("responde ---->" , response);
			let count = 1;
			while(response['length'] >= 1){
				response['length'] = response['length'] / 5;
				this.currentMonthLogsCount.push(count);
				count++;
			}
			if(count != 2)
				this.currentMonthLogsCount.push(count)
			console.log("this.currentMonthLogsCount " , this.currentMonthLogsCount);
		}, (err) => {
			console.log("err of getLogsByMonthDefault ==>" , err);
		});
	}
	openModel(index){
		console.log("hey" , index);
		this.modelValue = this.logs[index];
		$('#myModal').modal('show');
	}
	
	logout() {
		console.log("logiut ccalled");
		this._loginService.logout();
		this.router.navigate(['login']);
	}
	hello = [];
	allEmployees = {
		"diffrence": ""
	};

	getRecord(){
		this.flag = true;
		console.log("this.data;" , this.data);
		this.previousData = this.data;
		//find only first date . 
		if(this.data.firstDate){
			console.log(" this.data.firstDate " , this.data.firstDate);
			this.previousData = this.data;
			this._logService.getLogsBySingleDate(this.data).subscribe(res =>{
				this.logs = res;
				this. logs = this.sortDataByName(this.logs);
				// this.logs = this.properFormatDate(res);
				// this.currentMonthLogs = this.properFormatDate(res);
				// this.currentMonthLogs = res;

				this.searchData = res;

				// if(this.currentMonthLogs.length != 0){
					// 	this.previousData = false;
					// }
					const any = this.logs;

					const sum = any.reduce((acc, time) => acc.add(moment.duration(time)), moment.duration());

					console.log([Math.floor(sum.asHours()), sum.minutes(), sum.seconds()].join(':'));

					if (res == '') {
						this.totalHoursToEmp = "No Log Found";
					}
					else{
						console.log("the res of null is ====>");
					}
					this.flag = false;
					console.log(res);
				}, err =>{
					console.log("the log summery err is ======>",err);
					this.flag = false;
				});	
		}
	}




	getTodaysAttendance(){
		this._logService.getTodaysAttendance().subscribe((response:any) => {
			console.log('getTodaysAttendance response in logs '  , response);
			// this.currentMonthLogs = this.properFormatDate(response.data);
			// this.logs = this.properFormatDate(response.data);
			this.logs = response.data;
			this.logs = this.properFormatDate(this.logs);

			this.logs = this.sortDataByName(this.logs);

			this.searchData = response.data;

		} , (err) => {
			console.log('getTodaysAttendance error'  , err);
		})	
	}
	searchByName(items){
		var field1 = (<HTMLInputElement>document.getElementById("searchName")).value;
		console.log("field 1 =====> " , field1 , "current month logs =====>" , this.logs);

		// this.currentMonthLogs = this._filterPipe.transform(items, field1);
		this.logs = this._filterPipe.transform(items, field1);
		console.log("Items  =====> " , items );
	}
	resetForm(){
		this.search = false;
		this.calculateTotalDuration(this.currentMonthLogs , 5 , moment() , moment().subtract(6, 'days'));
		(<HTMLInputElement>document.getElementById("reportrange")).value = "";
	}
	getRangeDate(start, end){
		this.ngxLoader.start();
		this.http.get(`https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader`).subscribe((res: any) => {
			console.log(res);
			this.ngxLoader.stop();
		});
		console.log("RANGE FUNCTION CALLED");
		console.log(" date " ,new Date(start._d).toISOString() , new Date(end._d).toISOString());
		var increseStartDate:any = moment(start._d).add(1 , 'days');
		var body = {
			userId : JSON.parse(localStorage.getItem("currentUser"))._id,
			startDate : new Date(increseStartDate).toISOString(),
			endDate : new Date(end._d).toISOString()
		}
		this.search = true;
		this._logService.getLogsReportById(body).subscribe((res:any)=>{
			console.log("response of getLogsReportById" , res);
			if(res.foundLogs){ 
				this.logs = res.foundLogs;
			this.logs = this.properFormatDate(this.logs);

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
				// this.logs = this.properFormatDate(res.foundLogs);
				this.totalHoursToWork = res.TotalHoursToComplete;
				this.totalHoursWorked = res.TotalHoursCompleted;
				console.log("total hours attednent ====>" , this.totalHoursToWork);
				console.log("total hours to attendnace====>" , this.totalHoursWorked);
			}else{
				this.logs = res;
				this.totalHoursToWork = "No Log Found";
				this.totalHoursToEmp = "No Log Found";
				console.log("the logs is res equal is :====>",this.logs);
			}

		} , (err)=>{
			console.log("err of getLogsReportById" , err);
		});
	}
	calculateTotalDuration(array , resultHours, start , end){
		var workingHours = 0;
		var totalHours = 0;
		// console.log("start ========+++>" , start._d , "end ==>" , end._d);
		console.log("result hours =========>" , resultHours);
		if(resultHours < 1)
			resultHours = 1	
		for(var i = 0 ; i< Math.ceil(resultHours) ; i++){
			console.log(resultHours - i);
			var local:any = moment(start._d).subtract(i, 'days');
			local =  moment(local._d , "YYYY-MM-DD HH:mm:ss").format('dddd');
			// console.log("add date ====>" , moment(start._d).subtract(i, 'days')._d  , "local ady" ,local);
			if(local.toString() != "Sunday")
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

	// searchByName(items){
		// 	var field1 = (<HTMLInputElement>document.getElementById("nameSearch")).value;
		// 	this.filteredData = this._filterPipe.transform(items, field1);
		// }
		branchSelector(branchName){
			console.log(branchName);
			localStorage.setItem('branchSelected' , branchName);
			this.currentMonthLogs  = null;
			this.ngOnInit();
			// console.log("Branch name =====> " , localStorage.getItem('branchSelected'));
		}

		absentUser(){
			this._userService.getAllUsers().subscribe((res: any)=>{
				this.totalEmployees = res;
				this.absentEmp = this.totalEmployees.filter((singleEmployee, ind) => {
					let flag = false
					this.logs.forEach((presentEmployee, index)=>{

						if(singleEmployee._id == presentEmployee.userId){
							flag = true
							return false
						}
					});
					if(!flag){
						return singleEmployee
					}
				});
				console.log("Absent user ============>" , this.absentEmp)
				console.log("res of getAllUsers in all user component " , res);
			} , (err)=>{
				console.log("err of getAllUsers in all user component " , err);
			});
		}


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
		sortDataByName(data){
			data.sort(function(a, b){
				var nameA=a.user[0].name.toLowerCase().split(" ")[0], nameB=b.user[0].name.toLowerCase().split(" ")[0]
				// console.log("a =======+>",nameA , "B =======++>",nameB);
				if (nameA < nameB) //sort string ascending
					return -1 
				if (nameA > nameB)
					return 1
				return 0 //default return value (no sorting)
			});
			return data
		}
		properFormatDate(data){
			return data = data.filter((obj)=>{
				return obj.date = moment(obj.date).utc().format("DD/MM/YYYY");

			});
		}
	}