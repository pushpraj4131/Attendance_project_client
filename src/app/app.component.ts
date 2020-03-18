import { Component , OnInit , Input} from '@angular/core';
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
	userInfo = JSON.parse(localStorage.getItem("currentUser"));
	constructor( private route: ActivatedRoute,
		private router: Router, private loginService: LoginService, private http: HttpClient,
		private ngxLoader: NgxUiLoaderService) {  
		// this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
		this.loginService.isLoggedIn.subscribe((data) => {
			if(data === 'loggedIn') {
				this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
			}
		})
	}

	ngOnInit() {
		console.log("called");
		if(!this.userInfo){
			this.router.navigate(['/login']);
		}else{
			console.log("called 2nd time");
			console.log(this.userInfo);
			this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
			this.router.navigate(['/']);
		}
		
		//ngx-loader
		this.ngxLoader.start();
		this.http.get(`https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader`).subscribe((res: any) => {
			console.log(res);
			this.ngxLoader.stop();
		});
		
		// $(function() {
			// 	$("#searchName").autocomplete({
				// 		source: [ "akshita keratiya" , "vishal pankhaniya" , "vivek malvi" , "komal shakhiya" , "foram trada" , "happy bhalodiya" , "ram odedra" , "yuvrajsinh jadeja" , "meghna trivedi" , "swati chauhan" , "shraddha gami" , "ankit jadav" , "bhavik kalariya" , "kuldip koradia" , "rohit vishvakarma" , "mehul bhatt" , "kuldip siddhpura"],
				// 	});
				// });
				
			}
			getNotification(evt){
				console.log(evt);
			}

			userProfile(){
				console.log("the user id is : ======>", this.userInfo._id);
				this.router.navigate(['user-profile', this.userInfo._id])
			}
		}

