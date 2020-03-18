import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { LogsService }  from '../services/logs.service';
import { LoginService } from '../services/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

import * as moment from 'moment';
declare var $:any;
declare var Timeline:any
@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
	myForm:FormGroup;
	userInfo:any;
	password:any;
	edit:any = [];
	userId:any;
	show:boolean = false;

	allData:any = [];
	totalHoursToWork :any;
	totalHoursWorked :any;
	fiveDaysLogs: any = [];
	logs : any = [];
	search = false;
	data:any = [
	{
		year: '2004',
		title: 'This is a test title',
		image: 'https://picsum.photos/600/400'
	},
	{
		year: '2005',
		title: 'This is a test title 2',
		image: 'https://picsum.photos/600/400'
	},
	{
		year: '1990',
		title: 'This is a test title 3',
		image: 'https://picsum.photos/600/400'
	},
	{
		year: '2018',
		title: 'This is a test title 4',
		image: 'https://picsum.photos/600/400'
	},
	{
		year: '2005',
		title: 'This is a test title 2',
		image: 'https://picsum.photos/600/400'
	},
	{
		year: '2018',
		title: 'This is a test title 4',
		image: 'https://picsum.photos/600/400'
	},
	{
		year: '2018',
		title: 'This is a test title 4',
		image: 'https://picsum.photos/600/400'
	},
	{
		year: '2005',
		title: 'This is a test title 2',
		image: 'https://picsum.photos/600/400'
	},
	{
		year: '2018',
		title: 'This is a test title 4',
		image: 'https://picsum.photos/600/400'
	},
	];	

	allDataLogs = [];

	constructor(
		public _userService: UserService,
		public _router: Router,
		public _route: ActivatedRoute,
		public _fb: FormBuilder,
		public _loginService: LoginService,
		private http: HttpClient,
		private ngxLoader: NgxUiLoaderService,
		private _logService: LogsService,
		) {
		var self = this
		$(document).ready(function(){
			
			if(<HTMLInputElement>document.getElementById('timeline')) {
				let timeline = new Timeline('timeline', self.data);
				console.log("time line =====>", timeline);
				timeline.init();
			}
		});

		this.ngxLoader.start();
		this.http.get(`https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader`).subscribe((res: any) => {
			console.log(res);
			this.ngxLoader.stop();
		});

		
		this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
		this.userId = this._route.snapshot.paramMap.get('id');
		console.log("the edit component data is:", this.userInfo);
		this.myForm = new FormGroup({
			userRole: new FormControl('', [Validators.required]),
			branch: new FormControl(null),
			designation: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required]),
			name: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
		});
	}

	ngOnInit() {
		
		this.getEmpData();
		
		$(".timeline-wrapper .timeline-content-item > span").on("mouseenter mouseleave", function(e){
			$(".timeline-wrapper .timeline-content-item.active").removeClass("active");
			$(this).parent().addClass("active");
		});

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
			}, 150);
			$('[data-toggle="tooltip"]').tooltip();   
		});

		this.password = 'password';

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

	editProfile(){
		this._router.navigate(['edit-profile', this.userId]);
	}

	logout() {
		console.log("logiut ccalled");
		this._loginService.logout();
		this._router.navigate(['login']);
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
		this.allData = body;
		console.log("New changed ===>" , body);
		this.search = true;
		this._logService.getLogsReportById(body).subscribe((res:any)=>{
			console.log("response of getLogsReportById" , res);
			if(res.foundLogs){
				this.logs = res.foundLogs;
				this.totalHoursToWork = res.TotalHoursToComplete; 
				this.totalHoursWorked = res.TotalHoursCompleted; 
			}
			else{
				this.logs = res;
				this.totalHoursToWork = "No Log Found";
			}

		} , (err)=>{
			console.log("err of getLogsReportById" , err);
		});
	}



	public barChartOptions: ChartOptions = {
		responsive: true,
		scales: { xAxes: [{}], yAxes: [{}] },
			};
			public barChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
			public barChartType: ChartType = 'bar';
			public barChartLegend = true;

			public barChartData: ChartDataSets[] = [
			{ data: [8.30, 4, 5.30, 6.40, 7.10, 4, 6, 3, 7.50, 3.50, 5, 5.10], label: 'Series A' },
			{ data: [4, 5, 2, 5, 3, 6, 5.20, 6, 3.80, 1.50, 2.90, 1.50], label: 'Series B' }
			];


			public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
				console.log(event, active);
			}

			public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
				console.log(event, active);
			}

			public randomize(): void {
				this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
			}
		}
