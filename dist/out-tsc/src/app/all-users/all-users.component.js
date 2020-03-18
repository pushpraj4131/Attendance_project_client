import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FilterPipe } from '../filter.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
var AllUsersComponent = /** @class */ (function () {
    function AllUsersComponent(_userService, _filterPipe, route, router, _loginService) {
        this._userService = _userService;
        this._filterPipe = _filterPipe;
        this.route = route;
        this.router = router;
        this._loginService = _loginService;
    }
    AllUsersComponent.prototype.ngOnInit = function () {
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
        this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
        this.getAllUsers();
    };
    AllUsersComponent.prototype.getAllUsers = function () {
        var _this = this;
        this._userService.getAllUsers().subscribe(function (res) {
            _this.allUsers = res;
            _this.totalUsers = res.length;
            var data = res;
            _this.fromSearchedItems = data;
            console.log("res of getAllUsers in all user component ", res);
        }, function (err) {
            console.log("err of getAllUsers in all user component ", err);
        });
    };
    AllUsersComponent.prototype.searchByName = function (items) {
        var field1 = document.getElementById("nameSearch").value;
        this.allUsers = this._filterPipe.transform(items, field1);
    };
    AllUsersComponent.prototype.getUserDetail = function (userId) {
        console.log("user id => ", userId);
        this.router.navigate(['all-users/user-detail/' + userId]);
    };
    AllUsersComponent.prototype.logout = function () {
        console.log("logiut ccalled");
        this._loginService.logout();
        this.router.navigate(['login']);
    };
    AllUsersComponent.prototype.branchSelector = function (branchName) {
        console.log(branchName);
        localStorage.setItem('branchSelected', branchName);
        this.ngOnInit();
        // console.log("Branch name =====> " , localStorage.getItem('branchSelected'));
    };
    AllUsersComponent = __decorate([
        Component({
            selector: 'app-all-users',
            templateUrl: './all-users.component.html',
            styleUrls: ['./all-users.component.css'],
            providers: [FilterPipe]
        }),
        __metadata("design:paramtypes", [UserService,
            FilterPipe,
            ActivatedRoute,
            Router,
            LoginService])
    ], AllUsersComponent);
    return AllUsersComponent;
}());
export { AllUsersComponent };
//# sourceMappingURL=all-users.component.js.map