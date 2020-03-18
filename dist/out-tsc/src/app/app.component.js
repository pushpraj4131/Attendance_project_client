import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './services/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
var AppComponent = /** @class */ (function () {
    function AppComponent(route, router, loginService, http, ngxLoader) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.loginService = loginService;
        this.http = http;
        this.ngxLoader = ngxLoader;
        // userInfo : any;	
        this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
        // this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
        this.loginService.isLoggedIn.subscribe(function (data) {
            if (data === 'loggedIn') {
                _this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
            }
        });
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("called");
        if (!this.userInfo) {
            this.router.navigate(['/login']);
        }
        else {
            console.log("called 2nd time");
            console.log(this.userInfo);
            this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
            this.router.navigate(['/']);
        }
        //ngx-loader
        this.ngxLoader.start();
        this.http.get("https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader").subscribe(function (res) {
            console.log(res);
            _this.ngxLoader.stop();
        });
        // $(function() {
        // 	$("#searchName").autocomplete({
        // 		source: [ "akshita keratiya" , "vishal pankhaniya" , "vivek malvi" , "komal shakhiya" , "foram trada" , "happy bhalodiya" , "ram odedra" , "yuvrajsinh jadeja" , "meghna trivedi" , "swati chauhan" , "shraddha gami" , "ankit jadav" , "bhavik kalariya" , "kuldip koradia" , "rohit vishvakarma" , "mehul bhatt" , "kuldip siddhpura"],
        // 	});
        // });
    };
    AppComponent.prototype.getNotification = function (evt) {
        console.log(evt);
    };
    AppComponent.prototype.userProfile = function () {
        console.log("the user id is : ======>", this.userInfo._id);
        this.router.navigate(['user-profile', this.userInfo._id]);
    };
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router, LoginService, HttpClient,
            NgxUiLoaderService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map