import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { UserService } from '../services/user.service';
import { LogsService } from '../services/logs.service';
import { LoginService } from '../services/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
var UserDetailComponent = /** @class */ (function () {
    function UserDetailComponent(activatedRoute, router, _userService, _logService, _loginService, http, ngxLoader) {
        this.activatedRoute = activatedRoute;
        this.router = router;
        this._userService = _userService;
        this._logService = _logService;
        this._loginService = _loginService;
        this.http = http;
        this.ngxLoader = ngxLoader;
        this.isDisable = false;
        this.fiveDaysLogs = [];
        this.p = 1;
        this.data = {
            firstDate: "",
            secondDate: "",
        };
        this.logs = [];
        this.flag = false;
        this.getLogsBySingleDate = false;
        this.getLogsBetweenDates = false;
        this.search = false;
        this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
        this.userId = this.activatedRoute.snapshot.paramMap.get('id');
        console.log(this.userId);
    }
    UserDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        var self = this;
        $(document).ready(function () {
            setTimeout(function () {
                $(function () {
                    var start = moment().subtract(5, 'days');
                    var end = moment();
                    function cb(start, end) {
                        self.getRangeDate(start, end);
                    }
                    $('#reportrange').daterangepicker({
                        startDate: start,
                        endDate: end,
                        ranges: {
                            'Today': [moment() /*.add(1 , 'days')*/, moment()],
                            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                        }
                    }, cb);
                    cb(start, end);
                });
            }, 150);
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.getUserById();
        // this.getInitialRecord();
        //ngx-ui-loader
        this.ngxLoader.start();
        this.http.get("https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader").subscribe(function (res) {
            console.log(res);
            _this.ngxLoader.stop();
        });
    };
    UserDetailComponent.prototype.editProfile = function () {
        this.router.navigate(['edit-profile', this.userId]);
    };
    UserDetailComponent.prototype.getUserById = function () {
        var _this = this;
        this._userService.getUserById(this.userId).subscribe(function (res) {
            console.log("resposne of singleUser", res);
            _this.currentUserDetail = res;
        }, function (err) {
            console.log("error of singleUser", err);
        });
    };
    UserDetailComponent.prototype.deleteUser = function (i) {
        var _this = this;
        this._userService.adminDelEmployee(this.userId).subscribe(function (res) {
            console.log("the deleteUser response is:", res);
            _this.router.navigate(['/all-users']);
        }, function (err) {
            console.log("the delete user err :", err);
        });
    };
    // toDate(value){
    // 	console.log(value , this.searchForm.value);
    // 	this.isDisable =false;
    // }
    // getInitialRecord(){
    // 	this.search = false;
    // 	this._logService.getLastFiveDaysAttendance(this.userId).subscribe(async (response:any) => {
    // 		console.log("last five days response" , response);
    // 		if(response.foundLogs){
    // 			// await this.properFormatDate(response.foundLogs);
    // 			this.totalHoursToWork = response.TotalHoursToComplete; 
    // 			this.totalHoursWorked = response.TotalHoursCompleted; 
    // 			console.log("total hours attednent ====>" , this.totalHoursToWork);
    // 			console.log("total hours to attendnace====>" , this.totalHoursWorked);
    // 			this.fiveDaysLogs = response.foundLogs;
    // 			this.logs = [];
    // 		}else if(response.length == 0 && !response.foundLogs){
    // 			this.fiveDaysLogs = [];
    // 		}else{
    // 			this.fiveDaysLogs = [];
    // 		}
    // 		// await this.calculateTotalDuration(this.fiveDaysLogs , 5 , moment() , moment().subtract(6, 'days'));
    // 	} ,(err) => {
    // 		console.log("last five days error" , err);
    // 	});
    // }
    UserDetailComponent.prototype.resetForm = function () {
        this.search = false;
        document.getElementById("reportrange").value = "";
    };
    UserDetailComponent.prototype.openModel = function (index) {
        console.log("hey", index);
        this.modelValue = this.logs[index];
        console.log(this.modelValue);
        $('#myModal').modal('show');
    };
    UserDetailComponent.prototype.getRangeDate = function (start, end) {
        var _this = this;
        console.log(start._d, end._d, this.fiveDaysLogs);
        //ngx-ui-loader
        this.ngxLoader.start();
        this.http.get("https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader").subscribe(function (res) {
            console.log(res);
            _this.ngxLoader.stop();
        });
        console.log(" date ", new Date(start._d).toISOString(), new Date(end._d).toISOString());
        var increseStartDate = moment(start._d).add(1, 'days');
        // new Date(moment(start._d).add(1 , 'days')).toISOString()
        var body = {
            userId: this.userId,
            startDate: new Date(increseStartDate).toISOString(),
            endDate: new Date(end._d).toISOString()
        };
        console.log("New changed ===>", body);
        this.search = true;
        this._logService.getLogsReportById(body).subscribe(function (res) {
            console.log("response of getLogsReportById", res);
            if (res.foundLogs) {
                _this.logs = res.foundLogs;
                _this.totalHoursToWork = res.TotalHoursToComplete;
                _this.totalHoursWorked = res.TotalHoursCompleted;
            }
            else {
                _this.logs = res;
                _this.totalHoursToWork = "No Log Found";
                _this.totalHoursToWorkField = "No Logs Founds";
            }
            // this.calculateTotalDuration(this.logs , resultHours , start._d , end._d);
        }, function (err) {
            console.log("err of getLogsReportById", err);
        });
    };
    UserDetailComponent.prototype.logout = function () {
        console.log("logiut ccalled");
        this._loginService.logout();
        this.router.navigate(['login']);
    };
    UserDetailComponent.prototype.calculateTotalDuration = function (array, resultHours, start, end) {
        var workingHours = 0;
        var totalHours = 0;
        // console.log("start ========+++>" , start._d , "end ==>" , end._d);
        if (resultHours < 1)
            resultHours = 1;
        for (var i = 0; i < Math.ceil(resultHours); i++) {
            console.log(resultHours - i);
            var local = moment(start._d).subtract(i, 'days');
            local = moment(local._d, "YYYY-MM-DD HH:mm:ss").format('dddd');
            // console.log("add date ====>" , moment(start._d).subtract(i, 'days')._d  , "local ady" ,local);
            totalHours = totalHours + 30600;
        }
        array.forEach(function (obj) {
            // console.log(obj);
            if (obj.diffrence) {
                workingHours = workingHours + moment.duration(obj.diffrence).asSeconds();
                console.log("workingHours ====>", workingHours);
            }
        });
        //calculate total working hours 
        var minutes = Math.floor(totalHours / 60);
        totalHours = totalHours % 60;
        var hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        console.log("totalHours ====>", hours, minutes);
        this.totalHoursToWork = hours + ":" + minutes + ":" + "00";
        //calculate hours worked 
        var minutes = Math.floor(workingHours / 60);
        workingHours = workingHours % 60;
        var hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        this.totalHoursWorked = hours + ":" + minutes + ":" + "00";
        console.log("total hours attednent ====>", this.totalHoursToWork);
        console.log("total hours to attendnace====>", this.totalHoursWorked);
    };
    UserDetailComponent = __decorate([
        Component({
            selector: 'app-user-detail',
            templateUrl: './user-detail.component.html',
            styleUrls: ['./user-detail.component.css']
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            UserService,
            LogsService,
            LoginService,
            HttpClient,
            NgxUiLoaderService])
    ], UserDetailComponent);
    return UserDetailComponent;
}());
export { UserDetailComponent };
//# sourceMappingURL=user-detail.component.js.map