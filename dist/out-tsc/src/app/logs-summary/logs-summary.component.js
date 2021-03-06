import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { LogsService } from '../services/logs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FilterPipe } from '../filter.pipe';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
var LogsSummaryComponent = /** @class */ (function () {
    function LogsSummaryComponent(_logService, route, router, _loginService, _filterPipe, http, ngxLoader) {
        this._logService = _logService;
        this.route = route;
        this.router = router;
        this._loginService = _loginService;
        this._filterPipe = _filterPipe;
        this.http = http;
        this.ngxLoader = ngxLoader;
        this.currentMonthLogsCount = [];
        this.p = 1;
        //imported
        this.data = {
            firstDate: "",
            secondDate: "",
            name: ""
        };
        this.flag = false;
    }
    LogsSummaryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
        var branchName = localStorage.getItem('branchSelected');
        var self = this;
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
            $(function () {
                var start = moment().startOf('month');
                var end = moment().endOf('month');
                function cb(start, end) {
                    if (self.userInfo.userRole != 'admin')
                        self.getRangeDate(start, end);
                }
                $('#reportrange').daterangepicker({
                    startDate: start,
                    endDate: end,
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    }
                }, cb);
                cb(start, end);
            });
            $('[data-toggle="tooltip"]').tooltip();
        });
        // this.getLogsCountByMonthDefault();
        if (this.userInfo.userRole == 'admin') {
            this.getTodaysAttendance();
            this.search = false;
            // this.page(1);
        }
        //ngx-ui-loader
        this.ngxLoader.start();
        this.http.get("https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader").subscribe(function (res) {
            console.log(res);
            _this.ngxLoader.stop();
        });
    };
    // ADMIN FUNCTION
    LogsSummaryComponent.prototype.getLogsCountByMonthDefault = function () {
        var _this = this;
        this._logService.getLogsCountByMonthDefault().subscribe(function (response) {
            // this.currentMonthLogs = response;
            console.log("responde ---->", response);
            var count = 1;
            while (response['length'] >= 1) {
                response['length'] = response['length'] / 5;
                _this.currentMonthLogsCount.push(count);
                count++;
            }
            if (count != 2)
                _this.currentMonthLogsCount.push(count);
            console.log("this.currentMonthLogsCount ", _this.currentMonthLogsCount);
        }, function (err) {
            console.log("err of getLogsByMonthDefault ==>", err);
        });
    };
    LogsSummaryComponent.prototype.openModel = function (index) {
        console.log("hey", index);
        this.modelValue = this.logs[index];
        $('#myModal').modal('show');
    };
    // If userRole == employee
    // page(i){
    // 	console.log("====>" , i);
    // 	this._logService.getLogsByMonthDefaultByPage({page : i}).subscribe((response:any) => {
    // 		console.log("response of getLogsByMonthDefault ==>" , response);
    // 		this.currentMonthLogs = this.properFormatDate(response.foundLogs);
    // 		this.totalHoursToWork = response.TotalHoursToComplete;
    // 		this.totalHoursWorked = response.TotalHoursCompleted;
    // 		console.log("total hours attednent ====>" , this.totalHoursToWork);
    // 		console.log("total hours to attendnace====>" , this.totalHoursWorked);
    // 		// this.currentMonthLogs =  this.properFormatDate(response);
    // 		// this.calculateTotalDuration(this.currentMonthLogs , 5 , moment() , moment().subtract(6, 'days'));
    // 		// this.currentMonthLogs = response;
    // 	}, (err) => {
    // 		console.log("err of getLogsByMonthDefault ==>" , err);
    // 	});	
    // }
    LogsSummaryComponent.prototype.logout = function () {
        console.log("logiut ccalled");
        this._loginService.logout();
        this.router.navigate(['login']);
    };
    LogsSummaryComponent.prototype.getRecord = function () {
        var _this = this;
        this.flag = true;
        console.log("this.data;", this.data);
        this.previousData = this.data;
        //find only first date . 
        if (this.data.firstDate) {
            console.log(" this.data.firstDate ", this.data.firstDate);
            this.previousData = this.data;
            this._logService.getLogsBySingleDate(this.data).subscribe(function (res) {
                _this.logs = res;
                // this.logs = this.properFormatDate(res);
                // this.currentMonthLogs = this.properFormatDate(res);
                // this.currentMonthLogs = res;
                _this.searchData = res;
                // if(this.currentMonthLogs.length != 0){
                // 	this.previousData = false;
                // }
                _this.flag = false;
                console.log(res);
            }, function (err) {
                console.log(err);
                _this.flag = false;
            });
        }
    };
    LogsSummaryComponent.prototype.getTodaysAttendance = function () {
        var _this = this;
        this._logService.getTodaysAttendance().subscribe(function (response) {
            console.log('getTodaysAttendance response in logs ', response);
            // this.currentMonthLogs = this.properFormatDate(response.data);
            // this.logs = this.properFormatDate(response.data);
            _this.logs = response.data;
            _this.searchData = response.data;
        }, function (err) {
            console.log('getTodaysAttendance error', err);
        });
    };
    LogsSummaryComponent.prototype.searchByName = function (items) {
        var field1 = document.getElementById("searchName").value;
        console.log("field 1 =====> ", field1, "current month logs =====>", this.logs);
        // this.currentMonthLogs = this._filterPipe.transform(items, field1);
        this.logs = this._filterPipe.transform(items, field1);
        console.log("Items  =====> ", items);
    };
    LogsSummaryComponent.prototype.resetForm = function () {
        this.search = false;
        this.calculateTotalDuration(this.currentMonthLogs, 5, moment(), moment().subtract(6, 'days'));
        document.getElementById("reportrange").value = "";
    };
    LogsSummaryComponent.prototype.getRangeDate = function (start, end) {
        var _this = this;
        this.ngxLoader.start();
        this.http.get("https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader").subscribe(function (res) {
            console.log(res);
            _this.ngxLoader.stop();
        });
        console.log("RANGE FUNCTION CALLED");
        console.log(" date ", new Date(start._d).toISOString(), new Date(end._d).toISOString());
        var increseStartDate = moment(start._d).add(1, 'days');
        var body = {
            userId: JSON.parse(localStorage.getItem("currentUser"))._id,
            startDate: new Date(increseStartDate).toISOString(),
            endDate: new Date(end._d).toISOString()
        };
        this.search = true;
        this._logService.getLogsReportById(body).subscribe(function (res) {
            console.log("response of getLogsReportById", res);
            if (res.foundLogs) {
                _this.logs = res.foundLogs;
                // this.logs = this.properFormatDate(res.foundLogs);
                _this.totalHoursToWork = res.TotalHoursToComplete;
                _this.totalHoursWorked = res.TotalHoursCompleted;
                console.log("total hours attednent ====>", _this.totalHoursToWork);
                console.log("total hours to attendnace====>", _this.totalHoursWorked);
            }
            else {
                _this.logs = res;
            }
        }, function (err) {
            console.log("err of getLogsReportById", err);
        });
    };
    LogsSummaryComponent.prototype.calculateTotalDuration = function (array, resultHours, start, end) {
        var workingHours = 0;
        var totalHours = 0;
        // console.log("start ========+++>" , start._d , "end ==>" , end._d);
        console.log("result hours =========>", resultHours);
        if (resultHours < 1)
            resultHours = 1;
        for (var i = 0; i < Math.ceil(resultHours); i++) {
            console.log(resultHours - i);
            var local = moment(start._d).subtract(i, 'days');
            local = moment(local._d, "YYYY-MM-DD HH:mm:ss").format('dddd');
            // console.log("add date ====>" , moment(start._d).subtract(i, 'days')._d  , "local ady" ,local);
            if (local.toString() != "Sunday")
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
    // searchByName(items){
    // 	var field1 = (<HTMLInputElement>document.getElementById("nameSearch")).value;
    // 	this.filteredData = this._filterPipe.transform(items, field1);
    // }
    LogsSummaryComponent.prototype.branchSelector = function (branchName) {
        console.log(branchName);
        localStorage.setItem('branchSelected', branchName);
        this.currentMonthLogs = null;
        this.ngOnInit();
        // console.log("Branch name =====> " , localStorage.getItem('branchSelected'));
    };
    LogsSummaryComponent = __decorate([
        Component({
            selector: 'app-logs-summary',
            templateUrl: './logs-summary.component.html',
            styleUrls: ['./logs-summary.component.css'],
            providers: [FilterPipe]
        }),
        __metadata("design:paramtypes", [LogsService, ActivatedRoute,
            Router, LoginService, FilterPipe, HttpClient,
            NgxUiLoaderService])
    ], LogsSummaryComponent);
    return LogsSummaryComponent;
}());
export { LogsSummaryComponent };
//# sourceMappingURL=logs-summary.component.js.map