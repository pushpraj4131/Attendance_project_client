import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from '../services/login.service';
var AddUserComponent = /** @class */ (function () {
    function AddUserComponent(_userService, _router, _route, _fb, _loginService) {
        this._userService = _userService;
        this._router = _router;
        this._route = _route;
        this._fb = _fb;
        this._loginService = _loginService;
        this.allData = [];
        this.show = false;
        this.typeFlag = false;
        var branchName = localStorage.getItem('branchSelected');
        $(document).ready(function () {
            if (branchName == 'rajkot') {
                $("#rajkot").addClass("active");
                $("#ahemdabad").removeClass("active");
            }
            else {
                console.log("hey");
                $("#ahemdabad").addClass("active");
                $("#rajkot").removeClass("active");
            }
        });
        this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
        console.log("the edit component data is:", this.userInfo);
        this.myForm = new FormGroup({
            userRole: new FormControl('', [Validators.required]),
            branch: new FormControl('', [Validators.required]),
            designation: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required]),
            name: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        });
    }
    AddUserComponent.prototype.ngOnInit = function () {
        this.password = 'password';
    };
    AddUserComponent.prototype.onClick = function () {
        if (this.password === 'password') {
            this.password = 'text';
            this.show = true;
        }
        else {
            this.password = 'password';
            this.show = false;
        }
    };
    AddUserComponent.prototype.getType = function (event) {
        console.log(event.target.value);
        this.typeFlag = (event.target.value == 'Admin') ? true : false;
        this.myForm.patchValue({
            userRole: event.target.value
        });
        this.myForm.get('userRole').updateValueAndValidity();
        console.log(this.myForm.value);
    };
    AddUserComponent.prototype.getBranch = function (event) {
        console.log(event.target.value);
        this.typeFlag = (event.target.value == 'Rajkot') ? true : false;
        this.myForm.patchValue({
            branch: event.target.value
        });
        this.myForm.get('branch').updateValueAndValidity();
        console.log(this.myForm.value);
    };
    AddUserComponent.prototype.addUser = function (value) {
        var _this = this;
        var formData = new FormData();
        formData.append("userRole", this.myForm.value.userRole);
        formData.append("branch", this.myForm.value.branch);
        formData.append("designation", this.myForm.value.designation);
        formData.append("email", this.myForm.value.email);
        formData.append("name", this.myForm.value.name);
        formData.append("password", this.myForm.value.password);
        console.log("formData ======>", formData);
        console.log(this.myForm.value);
        this._userService.adminAddEmployee(this.myForm.value).subscribe(function (res) {
            console.log("the add allUser is : ", res);
            _this.allUserData = _this.allData.push(res);
            _this._router.navigate(['']);
        }, function (err) {
            console.log("the err is : ", err);
        });
    };
    AddUserComponent.prototype.logout = function () {
        console.log("logiut called");
        this._loginService.logout();
        this._router.navigate(['login']);
    };
    AddUserComponent.prototype.branchSelector = function (branchName) {
        console.log(branchName);
        localStorage.setItem('branchSelected', branchName);
        // this.currentMonthLogs  = null;
        this.ngOnInit();
        // console.log("Branch name =====> " , localStorage.getItem('branchSelected'));
    };
    AddUserComponent = __decorate([
        Component({
            selector: 'app-add-user',
            templateUrl: './add-user.component.html',
            styleUrls: ['./add-user.component.css']
        }),
        __metadata("design:paramtypes", [UserService,
            Router,
            ActivatedRoute,
            FormBuilder,
            LoginService])
    ], AddUserComponent);
    return AddUserComponent;
}());
export { AddUserComponent };
//# sourceMappingURL=add-user.component.js.map