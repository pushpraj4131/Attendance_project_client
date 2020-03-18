import { __awaiter, __decorate, __generator, __metadata } from "tslib";
import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { UserService } from '../services/user.service';
import { LogsService } from '../services/logs.service';
import { LoginService } from '../services/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
var UserReportComponent = /** @class */ (function () {
    // p: number = 1;
    function UserReportComponent(_logsService, _userService, router, _loginService, _change, http, ngxLoader) {
        this._logsService = _logsService;
        this._userService = _userService;
        this.router = router;
        this._loginService = _loginService;
        this._change = _change;
        this.http = http;
        this.ngxLoader = ngxLoader;
        this.foundRecordUser = null;
        this.p = 1;
        this.timeToWork = 30600;
        this.isDisable = false;
        this.modelDate = '';
        this.tableHeader = [];
        this.tableData = [];
        this.reportForm = new FormGroup({
            id: new FormControl(''),
            date: new FormControl('', Validators.required)
        });
    }
    UserReportComponent.prototype.ngOnInit = function () {
        var _this = this;
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
        this.reportForm.reset();
        this.searchRecordDate = null;
        this.foundRecordUser = null;
        this.tableData = [];
        this.tableHeader = [];
        this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
        this.getAllUsers();
        this.myDateValue = new Date();
        this.bsConfig = Object.assign({}, { containerClass: 'theme-green custom' });
        //ngx-ui-loader
        this.ngxLoader.start();
        this.http.get("https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader").subscribe(function (res) {
            console.log(res);
            _this.ngxLoader.stop();
        });
    };
    Object.defineProperty(UserReportComponent.prototype, "f", {
        get: function () { return this.reportForm.controls; },
        enumerable: true,
        configurable: true
    });
    UserReportComponent.prototype.getAllUsers = function () {
        var _this = this;
        this._userService.getAllUsers().subscribe(function (res) {
            console.log("all users ===>", res);
            // res.unshift({'_id' : 'All' , 'name' : 'All Employee'})
            _this.developers = res;
            _this.developers.sort(function (a, b) {
                var nameA = a.name.toLowerCase().split(" ")[0], nameB = b.name.toLowerCase().split(" ")[0];
                // console.log("a =======+>",nameA , "B =======++>",nameB);
                if (nameA < nameB) //sort string ascending
                    return -1;
                if (nameA > nameB)
                    return 1;
                return 0; //default return value (no sorting)
            });
            console.log("this.developers", _this.developers);
        }, function (err) {
            console.log("error in getting all users ===>", err);
        });
    };
    UserReportComponent.prototype.onOpenCalendar = function (container) {
        container.monthSelectHandler = function (event) {
            container._store.dispatch(container._actions.select(event.date));
        };
        container.setViewMode('month');
    };
    UserReportComponent.prototype.getReport = function (value) {
        var _this = this;
        //ngx-ui-loader
        this.ngxLoader.start();
        this.http.get("https://api.npmjs.org/downloads/range/last-month/ngx-ui-loader").subscribe(function (res) {
            console.log(res);
            _this.ngxLoader.stop();
        });
        this.fullTimeWorked = 0;
        this.lessTimeWorked = 0;
        this.monthDisplay = moment(value.date).format('MMMM');
        var newDate = moment(value.date).add(1, 'days');
        value['startDate'] = new Date(newDate).toISOString();
        newDate = moment(newDate).endOf('month');
        value['endDate'] = new Date(newDate._d).toISOString();
        delete value['date'];
        console.log("value ==>", value);
        if (value.id == null) {
            value.id = 'All';
        }
        this._logsService.getReportFlagWise(value).subscribe(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _i, _b, _c, key, value_1;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log("response ================>", res);
                        console.log("response ================>", res.length);
                        this.isDisable = false;
                        if (!(res.length == 0)) return [3 /*break*/, 1];
                        console.log("IN IF");
                        if (value.id != 'All') {
                            this.allEmployeeSearch = false;
                            console.log("No data found", value.id);
                            this.developers.forEach(function (dev) {
                                if (dev._id == value.id) {
                                    _this.searchRecordDate = moment(value.startDate).format('MMMM YYYY');
                                    _this.foundRecordUser = dev;
                                }
                            });
                            this.tableHeader = [];
                            this.logs = [];
                            this.tableData = [];
                            this.totalHoursWorked = 0;
                            this.totalHoursToWork = 0;
                            this._change.detectChanges();
                        }
                        else {
                            this.logs = [];
                            this.tableHeader = [];
                            this.totalHoursWorked = 0;
                            this.totalHoursToWork = 0;
                            this.tableData = [];
                            this.allEmployeeSearch = true;
                            this._change.detectChanges();
                        }
                        return [3 /*break*/, 4];
                    case 1:
                        if (!!res.foundLogs) return [3 /*break*/, 3];
                        console.log("IN else IF");
                        this.allEmployeeSearch = true;
                        this.logs = null;
                        this.searchRecordDate = null;
                        this.allEmployeeSearch = true;
                        this.allLogs = res;
                        console.log("this.allLogs ===>", res);
                        _a = this;
                        return [4 /*yield*/, this.formatResponse(this.allLogs)];
                    case 2:
                        _a.allLogs = _e.sent();
                        this.tableData = [];
                        this.tableHeader = [];
                        for (_i = 0, _b = Object.entries(this.allLogs[0]); _i < _b.length; _i++) {
                            _c = _b[_i], key = _c[0], value_1 = _c[1];
                            this.tableHeader.push(key);
                            this.tableData.push(value_1);
                        }
                        console.log("table header =++>", this.tableHeader);
                        console.log("table daat =+++>", this.tableData);
                        $(document).ready(function () {
                            setTimeout(function () {
                                console.log($('#allEmployeeTable').html() /*.split('--><!----><!--bindings={}--><!--bindings={"ng-reflect-ng-if": "true"}-->"')*/);
                            }, 1000);
                            console.log("HELLOO");
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        console.log("IN ELSE");
                        this.allEmployeeSearch = false;
                        res.foundLogs.forEach(function (data) {
                            if (data.diffrence != '-') {
                                data['seconds'] = moment.duration(data.diffrence).asSeconds();
                            }
                            else {
                                data['seconds'] = null;
                            }
                        });
                        res.foundLogs.forEach(function (data) {
                            if (data['seconds'] >= _this.timeToWork) {
                                _this.fullTimeWorked++;
                            }
                            else {
                                _this.lessTimeWorked++;
                            }
                        });
                        if (value.id != 'All') {
                            if (res.foundLogs.length > 0) {
                                this.developers.forEach(function (dev) {
                                    if (dev._id == value.id) {
                                        _this.foundRecordUser = dev;
                                    }
                                });
                            }
                        }
                        else {
                            this.foundRecordUser = null;
                        }
                        this.searchRecordDate = moment(value.startDate).format('MMMM YYYY');
                        this.allLogs = null;
                        this.logs = res.foundLogs;
                        this.totalHoursWorked = res.TotalHoursCompleted;
                        this.totalHoursToWork = res.TotalHoursToComplete;
                        _e.label = 4;
                    case 4:
                        this.reportForm.reset();
                        return [2 /*return*/];
                }
            });
        }); }, function (err) {
            _this.reportForm.reset();
            _this.isDisable = false;
            ;
            console.log("error of get report By flag", err);
        });
    };
    UserReportComponent.prototype.formatResponse = function (res1) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, _loop_1, this_1, flag, responseValue, responseKey, tempArr, _i, _a, _b, key, value, _c, _e, _f, key, value, temp, _g, _h, _j, key, value;
            return __generator(this, function (_k) {
                console.log("al res1ponse", res1);
                console.log("al ldevelopers", this.developers);
                obj = {
                    absentCount: null,
                    changed: null,
                    date: null,
                    day: null,
                    diffrence: null,
                    status: null,
                    timeLog: null,
                    user: [],
                    userId: null,
                    _id: null
                };
                _loop_1 = function (key, value) {
                    flag = 1;
                    responseValue = value;
                    responseKey = key;
                    // console.log("responseValue ==>" , responseValue , typeof responseValue);
                    if (typeof responseValue != 'string') {
                        this_1.developers.forEach(function (devData, index) {
                            responseValue.forEach(function (resData) {
                                if (devData._id == resData.user[0]._id) {
                                    flag = 0;
                                }
                            });
                            if (flag == 1) {
                                obj.user.push(devData);
                                res1[0][key].push(obj);
                            }
                            flag = 1;
                            obj = {
                                absentCount: null,
                                changed: null,
                                date: null,
                                day: null,
                                diffrence: null,
                                status: null,
                                timeLog: null,
                                user: [],
                                userId: null,
                                _id: null
                            };
                        });
                    }
                    else {
                        tempArr = [];
                        tempArr.push(responseValue);
                        res1[0][responseKey] = tempArr;
                    }
                };
                this_1 = this;
                for (_i = 0, _a = Object.entries(res1[0]); _i < _a.length; _i++) {
                    _b = _a[_i], key = _b[0], value = _b[1];
                    _loop_1(key, value);
                }
                // console.log("res1 [0 ] ======+++++>" , res1[0] );
                console.log("sorted response ===============>", res1);
                for (_c = 0, _e = Object.entries(res1[0]); _c < _e.length; _c++) {
                    _f = _e[_c], key = _f[0], value = _f[1];
                    // console.log("date changed" , key , value );
                    if (value != 'string') {
                        res1[0][key].sort(function (a, b) {
                            var nameA = a.user[0].name.toLowerCase().split(" ")[0], nameB = b.user[0].name.toLowerCase().split(" ")[0];
                            // console.log("a =======+>",nameA , "B =======++>",nameB);
                            if (nameA < nameB) //sort string ascending
                                return -1;
                            if (nameA > nameB)
                                return 1;
                            return 0; //default return value (no sorting)
                        });
                    }
                }
                console.log("sorted response ===============>", res1);
                temp = [];
                for (_g = 0, _h = Object.entries(res1[0]); _g < _h.length; _g++) {
                    _j = _h[_g], key = _j[0], value = _j[1];
                    // console.log("value =============>" , value);
                    // value = await this.sortValue(value);
                    temp.push(value);
                }
                temp.forEach(function (arrayData) {
                    // console.log("array aData +====>" ,typeof arrayData , arrayData , arrayData.length);
                    if (arrayData.length > 1) {
                        arrayData.forEach(function (objData) {
                            if (objData.diffrence == null) {
                                objData['seconds'] = 'AB';
                            }
                            else if (objData.diffrence == '-') {
                                objData['seconds'] = 'N/A';
                            }
                            else if (objData.diffrence != '-' || objData.diffrence != null) {
                                objData['seconds'] = moment.duration(objData.diffrence).asSeconds();
                            }
                        });
                    }
                });
                console.log("Modified res1s =+++++++++++++.", res1);
                this.allLogs = res1;
                console.log("this is all logs inside the function ", this.allLogs);
                return [2 /*return*/, res1];
            });
        });
    };
    UserReportComponent.prototype.getColor = function (value) {
        if (!isNaN(value)) {
            if (value < 30600) {
                return '#ff000066';
            }
            else if (value >= 34200) {
                return 'green';
            }
        }
        else {
            switch (value.toString()) {
                case "N/A":
                    return 'black';
                case 'AB':
                    return 'red';
                case 'Holiday or no working day':
                    return 'black';
                case 'Sunday':
                    return 'blue';
            }
        }
    };
    UserReportComponent.prototype.getBackGroundColor = function (value) {
        switch (value) {
            case "Holiday or no working day":
                return 'silver';
            case 'Sunday':
                return '#8c8cf366';
        }
    };
    UserReportComponent.prototype.getBackGroundColorSingleEmployee = function (value) {
        console.log("value of color", value);
        if (typeof value != 'string') {
            if (value < 30600) {
                return '#ff686810';
            }
            else {
                return '#00800010';
            }
        }
        else {
            if (value == 'Sunday') {
                return '#8c8cf366';
            }
            else {
                return 'silver';
            }
        }
    };
    UserReportComponent.prototype.getColorSingleEmployee = function (value) {
        console.log("VALUE +++++++++++++>", value);
        if (typeof value != 'string') {
            if (value < 30600) {
                return 'red';
            }
            else {
                return 'green';
            }
        }
        else {
            if (value == 'Sunday') {
                return 'blue';
            }
            else {
                return 'black';
            }
        }
    };
    UserReportComponent.prototype.openModel = function (indexOfDate, indexOfDiffrence) {
        // console.log("j =========+>" , indexOfDiffrence);
        if (this.allLogs != null) {
            this.modelMessage = null;
            console.log(indexOfDate, indexOfDiffrence, this.allLogs);
            console.log("Finally got an object ===>", this.allLogs[0][indexOfDate][indexOfDiffrence]);
            this.modelValue = this.allLogs[0][indexOfDate][indexOfDiffrence];
            if (this.modelValue._id == null) {
                this.modelMessage = this.modelValue.user[0].name + " was absent or no logs found of that date";
            }
        }
        else if (this.logs != null) {
            console.log("index ===>", indexOfDate);
            this.modelValue = this.logs[indexOfDate];
        }
        $('#myModal').modal('show');
    };
    UserReportComponent.prototype.logout = function () {
        console.log("logiut ccalled");
        this._loginService.logout();
        this.router.navigate(['login']);
    };
    UserReportComponent.prototype.branchSelector = function (branchName) {
        console.log(branchName);
        localStorage.setItem('branchSelected', branchName);
        this.ngOnInit();
    };
    UserReportComponent.prototype.sortValue = function (valueToSort) {
    };
    UserReportComponent = __decorate([
        Component({
            selector: 'app-user-report',
            templateUrl: './user-report.component.html',
            styleUrls: ['./user-report.component.css'],
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [LogsService,
            UserService,
            Router,
            LoginService,
            ChangeDetectorRef,
            HttpClient,
            NgxUiLoaderService])
    ], UserReportComponent);
    return UserReportComponent;
}());
export { UserReportComponent };
//# sourceMappingURL=user-report.component.js.map