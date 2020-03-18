import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
var LogsService = /** @class */ (function () {
    function LogsService(_http) {
        this._http = _http;
    }
    LogsService.prototype.getCurrentDateLogById = function () {
        console.log(" Into the service ");
        var body = {
            userId: JSON.parse(localStorage.getItem('currentUser'))._id
        };
        console.log(body);
        return this._http.post(config.baseApiUrl + "attendance/get-attendance-by-id", body);
    };
    LogsService.prototype.fillAttendance = function () {
        var body = {
            userId: JSON.parse(localStorage.getItem('currentUser'))._id,
            loginFlag: JSON.parse(localStorage.getItem('currentUser')).loginFlag
        };
        console.log("Body Of Fill attendace", body);
        return this._http.post(config.baseApiUrl + "attendance/fill-attendance", body);
    };
    LogsService.prototype.getLastFiveDaysAttendance = function (id) {
        if (id == 0) {
            var body = {
                userId: JSON.parse(localStorage.getItem('currentUser'))._id,
                days: '5'
            };
        }
        else {
            var body = {
                userId: id,
                days: '5'
            };
        }
        console.log(body);
        return this._http.post(config.baseApiUrl + "attendance/get-last-five-days-logs", body);
    };
    /*Services called from logs-summary*/
    LogsService.prototype.getLogsCountByMonthDefault = function () {
        var body = {};
        body['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
        return this._http.post(config.baseApiUrl + "attendance/get-current-month-logs-count", body);
    };
    LogsService.prototype.getLogsByMonthDefaultByPage = function (body) {
        if (JSON.parse(localStorage.getItem('currentUser')).userRole) {
            body['userRole'] = JSON.parse(localStorage.getItem('currentUser')).userRole;
        }
        body['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
        return this._http.post(config.baseApiUrl + "attendance/get-current-month-logs-by-page", body);
    };
    LogsService.prototype.getLogsReportById = function (body) {
        console.log(body);
        return this._http.post(config.baseApiUrl + "attendance/get-report-by-id", body);
    };
    //admin functions
    LogsService.prototype.getTodaysAttendance = function () {
        var body = {
            "branch": localStorage.getItem('branchSelected')
        };
        console.log("body in service ", body);
        return this._http.post(config.baseApiUrl + "attendance/get-todays-day-logs", body);
    };
    LogsService.prototype.getLogsBySingleDate = function (data) {
        console.log(data);
        data['branch'] = localStorage.getItem('branchSelected');
        return this._http.post(config.baseApiUrl + "attendance/get-logs-by-single-date", data);
    };
    LogsService.prototype.getReportFlagWise = function (body) {
        console.log(body);
        body['branch'] = localStorage.getItem('branchSelected');
        return this._http.post(config.baseApiUrl + "attendance/get-report-by-flag", body);
    };
    LogsService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], LogsService);
    return LogsService;
}());
export { LogsService };
//# sourceMappingURL=logs.service.js.map