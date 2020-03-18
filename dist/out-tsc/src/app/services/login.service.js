import { __decorate, __metadata } from "tslib";
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { config } from '../config';
var LoginService = /** @class */ (function () {
    function LoginService(_http) {
        this._http = _http;
        this.isLoggedIn = new EventEmitter();
        this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    Object.defineProperty(LoginService.prototype, "currentUserValue", {
        get: function () {
            return this.currentUserSubject.value;
        },
        enumerable: true,
        configurable: true
    });
    LoginService.prototype.loginUser = function (body) {
        var _this = this;
        return this._http.post(config.baseApiUrl + "user/login", body)
            .pipe(map(function (user) {
            console.log("login user=========>", user);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                _this.isLoggedIn.emit('loggedIn');
                _this.currentUserSubject.next(user);
            }
            return user;
        }));
    };
    LoginService.prototype.getIpCliente = function () {
        console.log("called this ==+>");
        return this._http.get('https://api.ipify.org');
    };
    LoginService.prototype.logout = function () {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    };
    LoginService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], LoginService);
    return LoginService;
}());
export { LoginService };
//# sourceMappingURL=login.service.js.map