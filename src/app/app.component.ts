import { Component , OnInit , Input, ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './services/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
	// userInfo : any;	
	selectedIndex:any = 0
	navData:any = [];

	navDataAdmin = [
	{
		name: 'Dashboard',
		iconClass: 'ni ni-tv-2 text-primary',
		routerLink: "",
		userRole: ""
	},
	{
		name: "Logs Summary",
		iconClass: "ni ni-bullet-list-67 text-red",
		routerLink: "/logs-summary",
		userRole: ""
	},
	{
		name: "Employees Report",
		iconClass: "ni ni-single-02 text-yellow",
		routerLink: "/user-report",
		userRole: "admin"
	},
	{
		name: "Add Employees",
		iconClass: "fas fa-user-friends text-blue",
		routerLink: "/add-user",
		userRole: "admin"
	},
	{
		name: "My Profile",
		iconClass: "fas fa-id-card text-green",
		routerLink: "",
		userRole: "",
	},
	]
	
	navDataEmployee = [
	{
		name: 'Dashboard',
		iconClass: 'ni ni-tv-2 text-primary',
		routerLink: "",
		userRole: ""
	},
	{
		name: "Logs Summary",
		iconClass: "ni ni-bullet-list-67 text-red",
		routerLink: "logs-summary",
		userRole: ""
	},
	{
		name: "My Profile",
		iconClass: "fas fa-id-card text-green",
		routerLink: "",
		userRole: "",
	},
	]	
	
	// navData:any = [
	// 	{
	// 		name: 'Dashboard',
	// 		iconClass: 'ni ni-tv-2 text-primary',
	// 		routerLink: "",
	// 		userRole: ""
	// 	},
	// 	{
	// 		name: "Logs Summary",
	// 		iconClass: "ni ni-bullet-list-67 text-red",
	// 		routerLink: "/logs-summary",
	// 		userRole: ""
	// 	},
	// 	{
	// 		name: "Employees Report",
	// 		iconClass: "ni ni-single-02 text-yellow",
	// 		routerLink: "/user-report",
	// 		userRole: "admin"
	// 	},
	// 	{
	// 		name: "Add Employees",
	// 		iconClass: "fas fa-user-friends text-blue",
	// 		routerLink: "/add-user",
	// 		userRole: "admin"
	// 	},
	// 	{
	// 		name: "My Profile",
	// 		iconClass: "fas fa-id-card text-green",
	// 		routerLink: "",
	// 		userRole: "",
	// 	},
	// ]
	userInfo = JSON.parse(localStorage.getItem("currentUser"));
	constructor( private route: ActivatedRoute,
		private router: Router, private loginService: LoginService, private http: HttpClient,
		private ngxLoader: NgxUiLoaderService, public _change: ChangeDetectorRef) {  
		this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
		this.loginService.isLoggedIn.subscribe((data) => {
			if(data == 'loggedIn') {
				this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
				
			}	
		});
	}

	ngOnInit() {
		console.log("called");
		if(!this.userInfo){
			this.router.navigate(['/login']);
		}else{
			console.log("called 2nd time");
			console.log(this.userInfo);
			this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
			this._change.detectChanges()
			this.router.navigate(['/']);
		}
	}
	getNotification(evt){
		console.log(evt);
	}

	userProfile(){
		console.log("the user id is : ======>", this.userInfo._id);
		this.router.navigate(['user-profile', this.userInfo._id])
	}
	selectIndex(i){
		this.selectedIndex = i
	}

}

