import { Component, OnInit , Output , Input , ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import { LogsService } from '../services/logs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipe } from '../filter.pipe';
import { EventEmitter } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
// RTCPeerConnection' does not exist on type 'Window'
declare var $;
interface window {
	RTCPeerConnection : any ;
	mozRTCPeerConnection : any ;
	webkitRTCPeerConnection : any
}
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
	providers: [FilterPipe]
})
export class DashboardComponent implements OnInit {
	modelValue : any;
	attendanceFlag: any ; 
	userInfo ;
	filledAttendanceLog ;
	entry : any;
	exit : any ;
	fiveDaysLogs : any = [];
	//admin variables
	todaysAttendance : any
	filteredData = [];
	totalUsers : any ;
	presentCount : any;
	allEmployees : any = [];
	p: number = 1;
	absentEmp:any = [];
	totalEmployees:any;

	loginFlag
	@Output() notifyParent: EventEmitter<any> = new EventEmitter();
	constructor(public _logService: LogsService, 
		private route: ActivatedRoute,
		private router: Router, 
		public _loginService: LoginService, 
		public _filterPipe: FilterPipe,
		public _change: ChangeDetectorRef,
		private http: HttpClient,
		private ngxLoader: NgxUiLoaderService,
		private _userService: UserService,
		) { }

	ngOnInit() {
		var branchName = localStorage.getItem('branchSelected');
		// localStorage.setItem('branchSelected' , 'ahemdabad');
		// this.getAllUsers();

		this.checkIp();
		var hello ;
		var self = this;
		$(document).ready(function(){
			if(branchName == 'rajkot'){
				$("#rajkot").addClass( "active");
				$("#ahemdabad").removeClass("active");
			}else{
				console.log("hey");
				$("#ahemdabad").addClass("active");
				$("#rajkot").removeClass("active");
			}
			// $("#ahemdabad").addClass( "active");
			$('[data-toggle="tooltip"]').tooltip();   
		});

		if (branchName == null) {
		localStorage.setItem('branchSelected' , 'ahemdabad');	
		console.log(branchName);
		}
		

		this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
		this.notifyParent.emit(this.userInfo);
		if(!this.userInfo){
			this.router.navigate(['/login']);
		}
		//admin functions
		if(this.userInfo.userRole == 'admin'){
			this.getTodaysAttendance();

		}
		//employees functions
		if(this.userInfo.userRole != 'admin'){
			this.getLastFiveDaysAttendance();
			this.getCurrentDateLogById();

		}

		//ngx-loader
		this.ngxLoader.start();
		this.http.get(`https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader`).subscribe((res: any) => {
			console.log(res);
			this.ngxLoader.stop();
		});
	}
	getCurrentDateLogById(){
		this._logService.getCurrentDateLogById().subscribe((response:any) => {
			console.log("response of getCurrentDateLogById ===>" , response);
			if(response.length){
				this.filledAttendanceLog = this.properFormatDate(response);
				// this.filledAttendanceLog = response;

				var timeLogLength = this.filledAttendanceLog[0].timeLog.length - 1;
				console.log(timeLogLength);
				var lastRecord = this.filledAttendanceLog[0].timeLog[timeLogLength].out;
				if(lastRecord != '-'){
					this.exit = this.filledAttendanceLog[0].timeLog[timeLogLength].out; 
					this.entry = false;
				}else{
					this.entry = this.filledAttendanceLog[0].timeLog[timeLogLength].in; 
					this.exit = false;
				}

			}	
		}, (err)=>{
			console.log("error of getCurrentDateLogById ===>" , err);
		});
	}
	checkIp(){
		console.log("hye in check");
		this._loginService.getIpCliente().subscribe((response)=>{
		},(err)=>{
			console.log("this --------------> ",err);
			if(err.error.text == '119.160.195.171' || err.error.text == '27.57.190.69' || err.error.text == '27.54.180.182' || err.error.text == '122.170.44.56'){
				this.loginFlag = true;
				this.userInfo['loginFlag'] = true;
				localStorage.setItem('currentUser', JSON.stringify(this.userInfo));
				// alert(err.error.text + " --> Valid IP");	
			}
			else{	
				this.loginFlag = false;
				this.userInfo['loginFlag'] = false;
				localStorage.setItem('currentUser', JSON.stringify(this.userInfo));
				// alert(err.error.text + " ---> Invalid IP");
			}
		});
	}
	fillAttendance(){
		if(JSON.parse(localStorage.getItem('currentUser')).loginFlag == false){
			Swal.fire({
				title: 'Are you sure?',
				text: "Mark attendance from unauthorized IP address",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, Mark Attendance!'
			}).then((result) => {
				if (result.value) {
					this.MarkAttendance();
				}
			});
		}
		else{
			this.MarkAttendance();
		}
	}
	MarkAttendance(){
		this._logService.fillAttendance().subscribe((response:any) =>{
			console.log("response ====>" , response);
			
			this.filledAttendanceLog = this.properFormatDate(response);
			this.filledAttendanceLog=this.filledAttendanceLog.reverse();  
			var flag = 0;
			this._change.detectChanges();
			if(this.fiveDaysLogs){
				console.log("IN IFFFFFFFFFFFFF =============?");
				this.fiveDaysLogs.filter((data)=>{
					console.log("IN IFFFFFFFFFFFFF =============?" , data.date == this.filledAttendanceLog[0].date);
					if(data.date == this.filledAttendanceLog[0].date){
						console.log(data.date , this.filledAttendanceLog[0].date)
						flag = 1;
					}
				});
				console.log("IN IFFFFFFFFFFFFF =============?", this.fiveDaysLogs);

			}
			if(flag == 0 && this.fiveDaysLogs){
				this.fiveDaysLogs.unshift(this.filledAttendanceLog[0]);
			}else{
				this.fiveDaysLogs[0] = this.filledAttendanceLog[0];
			}
			var timeLogLength = this.filledAttendanceLog[0].timeLog.length - 1;
			console.log(timeLogLength);
			var lastRecord = this.filledAttendanceLog[0].timeLog[timeLogLength].out;
			if(lastRecord != '-'){
				this.exit = this.filledAttendanceLog[0].timeLog[timeLogLength].out; 
				this.entry = false;
			}else{
				this.entry = this.filledAttendanceLog[0].timeLog[timeLogLength].in; 
				this.exit = false;
			}
		} , (err) =>{
			console.log("err ===>" , err);
		});

	}
	getLastFiveDaysAttendance(){
		var id = 0;
		this._logService.getLastFiveDaysAttendance(id).subscribe((response:any) => {
			console.log("last five days response" , response);
			if(response.message != 'No logs found'){
				this.fiveDaysLogs = this.properFormatDate(response.foundLogs);
				this.fiveDaysLogs = this.fiveDaysLogs.reverse();  
			}
			this._change.detectChanges();
			// this.fiveDaysLogs = response;
		} ,(err) => {
			console.log("last five days error" , err);
		});
	}
	logout() {
		console.log("logiut ccalled");
		this._loginService.logout();
		this.router.navigate(['login']);
		localStorage.removeItem('branchSelected');

	}
	openModel(index){
		console.log("hey" , index);
		if(!this.userInfo.userRole || this.userInfo.userRole == 'employee')
			this.modelValue = this.fiveDaysLogs[index];
		else{
			console.log("this.todaysAttendance in else ====>" , this.todaysAttendance);
			this.modelValue = this.todaysAttendance[index];
		}
		console.log(this.modelValue);
		$('#myModal').modal('show');


	}

	//admin functionalities
	getTodaysAttendance(){
		this._logService.getTodaysAttendance().subscribe((response:any) => {
			console.log('getTodaysAttendance response'  , response);
			console.log('getTodaysAttendance response'  , response.data);
			this.presentCount = response.presentCount;
			this.totalUsers = response.totalUser;
			this.todaysAttendance = this.properFormatDate(response.data);
			const data = JSON.stringify(this.todaysAttendance);
			this.filteredData = JSON.parse(data);
		} , (err) => {
			console.log('getTodaysAttendance error'  , err);
		})	
	}
	searchByName(items){
		var field1 = (<HTMLInputElement>document.getElementById("nameSearch")).value;
		console.log(field1)
		this.todaysAttendance = this._filterPipe.transform(items, field1);
	}
	


	getUserIP(onNewIP) {        
		var myPeerConnection = (<any>window).RTCPeerConnection || (<any>window).mozRTCPeerConnection  || (<any>window).webkitRTCPeerConnection;
		var pc = new myPeerConnection({
			iceServers: []
		}),
		noop = function() {},
		localIPs = {},
		ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
		key;

		function iterateIP(ip) {
			if (!localIPs[ip]) onNewIP(ip);
			localIPs[ip] = true;
		}

		//create a bogus data channel
		pc.createDataChannel("");

		// create offer and set local description
		pc.createOffer(function(sdp) {
			sdp.sdp.split('\n').forEach(function(line) {
				if (line.indexOf('candidate') < 0) return;
				line.match(ipRegex).forEach(iterateIP);
			});

			pc.setLocalDescription(sdp, noop, noop);
		}, noop); 

		//listen for candidate events
		pc.onicecandidate = function(ice) {
			if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
			ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
		};
	}
	properFormatDate(data){
		return data = data.filter((obj)=>{
			return obj.date = moment(obj.date).utc().format("DD/MM/YYYY");

		});
	}
	branchSelector(branchName){
		console.log(branchName);
		localStorage.setItem('branchSelected' , branchName);
		this.ngOnInit();
		// console.log("Branch name =====> " , localStorage.getItem('branchSelected'));
	}

	absentUser(){
		this._userService.getAllUsers().subscribe((res: any)=>{
			this.totalEmployees = res;
			console.log("res of getAllUsers in all user component " , res);
		} , (err)=>{
			console.log("err of getAllUsers in all user component " , err);
		});

		this._logService.getTodaysAttendance().subscribe((response:any) => {
			console.log('getTodaysAttendance response', response);

			const totalEmp = this.totalEmployees;
			const presentEmp = response.data;

			const absentEmployees = totalEmp.filter((obj) => {
				return totalEmp.indexOf(obj._id) == -1;
			});

			console.log("the absent user array ===>",absentEmployees);
			
			const presentEmployees = presentEmp.filter((obj, index) => {
				console.log("the presentEmployees of the object is =====>",obj);
				this.allEmployees.push(obj.user[0]);
				console.log("the absent object is ====>",obj.user[0]);
				return totalEmp.indexOf(obj.user[0]) == -1;
			});

			var totalUser = totalEmp;
			var presentUser = this.allEmployees;
			console.log("the total user is ====>", totalUser);
			console.log("the present user is ===>", presentUser);

			var absentUser = totalUser.filter((item1) => !presentUser.some((item2) => (item2._id === item1._id)))

			console.log("absentUser user details of array",absentUser);
			this.absentEmp = absentUser;


		} , (err) => {
			console.log('getTodaysAttendance error'  , err);
		});
	}
}
