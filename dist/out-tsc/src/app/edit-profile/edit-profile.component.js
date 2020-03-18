import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
var EditProfileComponent = /** @class */ (function () {
    function EditProfileComponent(_userService, _router, _route, _fb, _loginService, http, ngxLoader) {
        this._userService = _userService;
        this._router = _router;
        this._route = _route;
        this._fb = _fb;
        this._loginService = _loginService;
        this.http = http;
        this.ngxLoader = ngxLoader;
        this.edit = [];
        this.show = false;
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
    EditProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getEmpData();
        this.password = 'password';
        this.ngxLoader.start();
        this.http.get("https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader").subscribe(function (res) {
            console.log(res);
            _this.ngxLoader.stop();
        });
    };
    EditProfileComponent.prototype.getEmpData = function () {
        var _this = this;
        this._userService.getUserById(this.userId).subscribe(function (res) {
            _this.edit = res;
            console.log("the allDat of user response is =====>", res);
        }, function (err) {
            console.log("the allData of user err is ===>", err);
        });
    };
    EditProfileComponent.prototype.onClick = function () {
        if (this.password === 'password') {
            this.password = 'text';
            this.show = true;
        }
        else {
            this.password = 'password';
            this.show = false;
        }
    };
    EditProfileComponent.prototype.updateUser = function (id, edit) {
        var _this = this;
        console.log("the all Edit data is ======>", this.edit);
        this._userService.getEditById(this.userId, this.edit).subscribe(function (res) {
            console.log("the edit data is: =====>", res);
            _this._router.navigate(['user-profile', _this.userId]);
        }, function (err) {
            console.log("the edit data err is: ===>", err);
        });
    };
    EditProfileComponent.prototype.updatePass = function (id, userInfo) {
        this.userInfo.password = this.passForm.value.confirmPassword;
        console.log("the edit data is: =====>", this.userInfo.password);
        this.edit = this.userInfo;
        this.passForm.reset();
        // this._userService.getEditById(this.userInfo._id, this.userInfo).subscribe((res:any) => {
        // }, (err) => {
        // 	console.log("the edit data err is: ===>", err);
        // })
    };
    EditProfileComponent.prototype.logout = function () {
        console.log("logiut ccalled");
        this._loginService.logout();
        this._router.navigate(['login']);
    };
    EditProfileComponent = __decorate([
        Component({
            selector: 'app-edit-profile',
            templateUrl: './edit-profile.component.html',
            styleUrls: ['./edit-profile.component.css']
        }),
        __metadata("design:paramtypes", [UserService,
            Router,
            ActivatedRoute,
            FormBuilder,
            LoginService,
            HttpClient,
            NgxUiLoaderService])
    ], EditProfileComponent);
    return EditProfileComponent;
}());
export { EditProfileComponent };
//# sourceMappingURL=edit-profile.component.js.map