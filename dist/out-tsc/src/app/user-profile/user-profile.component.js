import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
var UserProfileComponent = /** @class */ (function () {
    function UserProfileComponent(_userService, _router, _route, _fb, _loginService, http, ngxLoader) {
        var _this = this;
        this._userService = _userService;
        this._router = _router;
        this._route = _route;
        this._fb = _fb;
        this._loginService = _loginService;
        this.http = http;
        this.ngxLoader = ngxLoader;
        this.edit = [];
        this.ngxLoader.start();
        this.http.get("https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader").subscribe(function (res) {
            console.log(res);
            _this.ngxLoader.stop();
        });
        this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.userId = this._route.snapshot.paramMap.get('id');
        console.log(this.userId);
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
    UserProfileComponent.prototype.ngOnInit = function () {
        this.getEmpData();
    };
    UserProfileComponent.prototype.getEmpData = function () {
        var _this = this;
        this._userService.getUserById(this.userId).subscribe(function (res) {
            _this.edit = res;
            console.log("the allDat of user response is =====>", res);
        }, function (err) {
            console.log("the allData of user err is ===>", err);
        });
    };
    UserProfileComponent.prototype.editProfile = function () {
        this._router.navigate(['edit-profile', this.userId]);
    };
    UserProfileComponent.prototype.logout = function () {
        console.log("logiut ccalled");
        this._loginService.logout();
        this._router.navigate(['login']);
    };
    UserProfileComponent = __decorate([
        Component({
            selector: 'app-user-profile',
            templateUrl: './user-profile.component.html',
            styleUrls: ['./user-profile.component.css']
        }),
        __metadata("design:paramtypes", [UserService,
            Router,
            ActivatedRoute,
            FormBuilder,
            LoginService,
            HttpClient,
            NgxUiLoaderService])
    ], UserProfileComponent);
    return UserProfileComponent;
}());
export { UserProfileComponent };
//# sourceMappingURL=user-profile.component.js.map