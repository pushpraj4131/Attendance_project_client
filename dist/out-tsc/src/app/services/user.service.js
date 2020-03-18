import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
var UserService = /** @class */ (function () {
    function UserService(_http) {
        this._http = _http;
    }
    UserService.prototype.getAllUsers = function () {
        var body = {
            'branch': localStorage.getItem('branchSelected')
        };
        return this._http.post(config.baseApiUrl + "user/get-users", body);
    };
    UserService.prototype.getUserById = function (id) {
        return this._http.get(config.baseApiUrl + "user/get-user-by-id/" + id);
    };
    UserService.prototype.getEditById = function (id, value) {
        console.log("the service data is: ", id, value);
        return this._http.put(config.baseApiUrl + "user/update-user-by-id/" + id, value);
    };
    UserService.prototype.adminAddEmployee = function (value) {
        console.log("the service data is: ", value);
        return this._http.post(config.baseApiUrl + "user/signup", value);
    };
    UserService.prototype.adminDelEmployee = function (id) {
        // console.log("the service del id is:", id);
        return this._http.delete(config.baseApiUrl + "user/delete-user-by-id/" + id);
    };
    UserService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], UserService);
    return UserService;
}());
export { UserService };
//# sourceMappingURL=user.service.js.map