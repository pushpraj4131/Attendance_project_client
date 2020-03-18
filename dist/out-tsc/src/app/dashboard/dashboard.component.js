import { __decorate, __metadata } from "tslib";
import { Component, Output, ChangeDetectorRef } from '@angular/core';
import { LogsService } from '../services/logs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FilterPipe } from '../filter.pipe';
import { EventEmitter } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(_logService, route, router, _loginService, _filterPipe, _change, http, ngxLoader) {
        this._logService = _logService;
        this.route = route;
        this.router = router;
        this._loginService = _loginService;
        this._filterPipe = _filterPipe;
        this._change = _change;
        this.http = http;
        this.ngxLoader = ngxLoader;
        this.fiveDaysLogs = [];
        this.filteredData = [];
        this.p = 1;
        this.notifyParent = new EventEmitter();
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        var branchName = localStorage.getItem('branchSelected');
        // localStorage.setItem('branchSelected' , 'ahemdabad');
        // console.log(branchName);
        this.checkIp();
        var hello;
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
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
        this.notifyParent.emit(this.userInfo);
        if (!this.userInfo) {
            this.router.navigate(['/login']);
        }
        //admin functions
        if (this.userInfo.userRole == 'admin') {
            this.getTodaysAttendance();
        }
        //employees functions
        if (this.userInfo.userRole != 'admin') {
            this.getLastFiveDaysAttendance();
            this.getCurrentDateLogById();
        }
        //ngx-loader
        this.ngxLoader.start();
        this.http.get("https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader").subscribe(function (res) {
            console.log(res);
            _this.ngxLoader.stop();
        });
    };
    DashboardComponent.prototype.getCurrentDateLogById = function () {
        var _this = this;
        this._logService.getCurrentDateLogById().subscribe(function (response) {
            console.log("response of getCurrentDateLogById ===>", response);
            if (response.length) {
                _this.filledAttendanceLog = _this.properFormatDate(response);
                // this.filledAttendanceLog = response;
                var timeLogLength = _this.filledAttendanceLog[0].timeLog.length - 1;
                console.log(timeLogLength);
                var lastRecord = _this.filledAttendanceLog[0].timeLog[timeLogLength].out;
                if (lastRecord != '-') {
                    _this.exit = _this.filledAttendanceLog[0].timeLog[timeLogLength].out;
                    _this.entry = false;
                }
                else {
                    _this.entry = _this.filledAttendanceLog[0].timeLog[timeLogLength].in;
                    _this.exit = false;
                }
            }
        }, function (err) {
            console.log("error of getCurrentDateLogById ===>", err);
        });
    };
    DashboardComponent.prototype.checkIp = function () {
        var _this = this;
        this._loginService.getIpCliente().subscribe(function (response) {
            console.log("this --------------> ", response);
        }, function (err) {
            if (err.error.text == '119.160.195.171' || err.error.text == '27.57.190.69' || err.error.text == '27.54.180.182 ' || err.error.text == '122.170.44.56') {
                _this.loginFlag = true;
                _this.userInfo['loginFlag'] = true;
                localStorage.setItem('currentUser', JSON.stringify(_this.userInfo));
                // alert(err.error.text + " --> Valid IP");	
            }
            else {
                _this.loginFlag = false;
                _this.userInfo['loginFlag'] = false;
                localStorage.setItem('currentUser', JSON.stringify(_this.userInfo));
                // alert(err.error.text + " ---> Invalid IP");
            }
        });
    };
    DashboardComponent.prototype.fillAttendance = function () {
        var _this = this;
        if (JSON.parse(localStorage.getItem('currentUser')).loginFlag == false) {
            Swal.fire({
                title: 'Are you sure?',
                text: "Mark attendance from unauthorized IP address",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Mark Attendance!'
            }).then(function (result) {
                if (result.value) {
                    _this.MarkAttendance();
                }
            });
        }
        else {
            this.MarkAttendance();
        }
    };
    DashboardComponent.prototype.MarkAttendance = function () {
        var _this = this;
        this._logService.fillAttendance().subscribe(function (response) {
            console.log("response ====>", response);
            _this.filledAttendanceLog = _this.properFormatDate(response);
            _this.filledAttendanceLog = _this.filledAttendanceLog.reverse();
            var flag = 0;
            _this._change.detectChanges();
            if (_this.fiveDaysLogs) {
                console.log("IN IFFFFFFFFFFFFF =============?");
                _this.fiveDaysLogs.filter(function (data) {
                    console.log("IN IFFFFFFFFFFFFF =============?", data.date == _this.filledAttendanceLog[0].date);
                    if (data.date == _this.filledAttendanceLog[0].date) {
                        console.log(data.date, _this.filledAttendanceLog[0].date);
                        flag = 1;
                    }
                });
                console.log("IN IFFFFFFFFFFFFF =============?", _this.fiveDaysLogs);
            }
            if (flag == 0 && _this.fiveDaysLogs) {
                _this.fiveDaysLogs.unshift(_this.filledAttendanceLog[0]);
            }
            else {
                _this.fiveDaysLogs[0] = _this.filledAttendanceLog[0];
            }
            var timeLogLength = _this.filledAttendanceLog[0].timeLog.length - 1;
            console.log(timeLogLength);
            var lastRecord = _this.filledAttendanceLog[0].timeLog[timeLogLength].out;
            if (lastRecord != '-') {
                _this.exit = _this.filledAttendanceLog[0].timeLog[timeLogLength].out;
                _this.entry = false;
            }
            else {
                _this.entry = _this.filledAttendanceLog[0].timeLog[timeLogLength].in;
                _this.exit = false;
            }
        }, function (err) {
            console.log("err ===>", err);
        });
    };
    DashboardComponent.prototype.getLastFiveDaysAttendance = function () {
        var _this = this;
        var id = 0;
        this._logService.getLastFiveDaysAttendance(id).subscribe(function (response) {
            console.log("last five days response", response);
            if (response.message != 'No logs found') {
                _this.fiveDaysLogs = _this.properFormatDate(response.foundLogs);
                _this.fiveDaysLogs = _this.fiveDaysLogs.reverse();
            }
            _this._change.detectChanges();
            // this.fiveDaysLogs = response;
        }, function (err) {
            console.log("last five days error", err);
        });
    };
    DashboardComponent.prototype.logout = function () {
        console.log("logiut ccalled");
        this._loginService.logout();
        this.router.navigate(['login']);
    };
    DashboardComponent.prototype.openModel = function (index) {
        console.log("hey", index);
        if (!this.userInfo.userRole || this.userInfo.userRole == 'employee')
            this.modelValue = this.fiveDaysLogs[index];
        else {
            console.log("this.todaysAttendance in else ====>", this.todaysAttendance);
            this.modelValue = this.todaysAttendance[index];
        }
        console.log(this.modelValue);
        $('#myModal').modal('show');
    };
    //admin functionalities
    DashboardComponent.prototype.getTodaysAttendance = function () {
        var _this = this;
        this._logService.getTodaysAttendance().subscribe(function (response) {
            co; // this.absentCount = res.
            _this.todaysAttendance = _this.properFormatDate(response.data);
            var data = JSON.stringify(_this.todaysAttendance);
            _this.filteredData = JSON.parse(data);
        }, function (err) {
            console.log('getTodaysAttendance error', err);
        });
    };
    DashboardComponent.prototype.searchByName = function (items) {
        var field1 = document.getElementById("nameSearch").value;
        console.log(field1);
        this.todaysAttendance = this._filterPipe.transform(items, field1);
    };
    DashboardComponent.prototype.getUserIP = function (onNewIP) {
        var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var pc = new myPeerConnection({
            iceServers: []
        }), noop = function () { }, localIPs = {}, ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g, key;
        function iterateIP(ip) {
            if (!localIPs[ip])
                onNewIP(ip);
            localIPs[ip] = true;
        }
        //create a bogus data channel
        pc.createDataChannel("");
        // create offer and set local description
        pc.createOffer(function (sdp) {
            sdp.sdp.split('\n').forEach(function (line) {
                if (line.indexOf('candidate') < 0)
                    return;
                line.match(ipRegex).forEach(iterateIP);
            });
            pc.setLocalDescription(sdp, noop, noop);
        }, noop);
        //listen for candidate events
        pc.onicecandidate = function (ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex))
                return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
    };
    DashboardComponent.prototype.properFormatDate = function (data) {
        return data = data.filter(function (obj) {
            return obj.date = moment(obj.date).utc().format("DD/MM/YYYY");
        });
    };
    DashboardComponent.prototype.branchSelector = function (branchName) {
        console.log(branchName);
        localStorage.setItem('branchSelected', branchName);
        this.ngOnInit();
        // console.log("Branch name =====> " , localStorage.getItem('branchSelected'));
    };
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], DashboardComponent.prototype, "notifyParent", void 0);
    DashboardComponent = __decorate([
        Component({
            selector: 'app-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.css'],
            providers: [FilterPipe]
        }),
        __metadata("design:paramtypes", [LogsService,
            ActivatedRoute,
            Router,
            LoginService,
            FilterPipe,
            ChangeDetectorRef,
            HttpClient,
            NgxUiLoaderService])
    ], DashboardComponent);
    return DashboardComponent;
}());
export { DashboardComponent };
//# sourceMappingURL=dashboard.component.js.map