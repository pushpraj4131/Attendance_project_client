import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
// import Swal from 'sweetalert2';
// import Swal from 'sweetalert2/dist/sweetalert2.js'
var LoginComponent = /** @class */ (function () {
    function LoginComponent(_loginService, route, router) {
        this._loginService = _loginService;
        this.route = route;
        this.router = router;
        this.isError = false;
        this.isDisable = false;
        this.loginFlag = false;
        if (this._loginService.currentUserValue) {
            this.router.navigate(['/']);
        }
        this.loginForm = new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }
    LoginComponent.prototype.ngOnInit = function () {
        // this.checkIp();
    };
    Object.defineProperty(LoginComponent.prototype, "f", {
        get: function () { return this.loginForm.controls; },
        enumerable: true,
        configurable: true
    });
    LoginComponent.prototype.login = function (value) {
        var _this = this;
        this._loginService.loginUser(value).subscribe(function (response) {
            console.log("successfull login", response);
            _this.isDisable = false;
            _this.isError = false;
            localStorage.setItem('currentUser', JSON.stringify(response));
            // this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
            _this.router.navigate(['']);
        }, function (err) {
            console.log(err.status);
            if (err.status == 400) {
                _this.errorMessage = "Check your Email/Password and try again";
            }
            else if (err.status == 404) {
                _this.errorMessage = "Please check out the connection and try again";
            }
            else if (err.status == 500) {
                _this.errorMessage = "We are sorry for it , try again after sometime";
            }
            _this.isError = true;
            console.log("err in login ", err);
        });
        console.log(value);
    };
    LoginComponent = __decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        }),
        __metadata("design:paramtypes", [LoginService,
            ActivatedRoute,
            Router])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
//# sourceMappingURL=login.component.js.map