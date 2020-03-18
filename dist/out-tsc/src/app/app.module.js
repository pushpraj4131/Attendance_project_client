import { __decorate } from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { FilterPipe} from './filter.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogsSummaryComponent } from './logs-summary/logs-summary.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';
import { FilterPipe } from './filter.pipe';
import { AllUsersComponent } from './all-users/all-users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { TestingDatepickerComponent } from './testing-datepicker/testing-datepicker.component';
import { UserReportComponent } from './user-report/user-report.component';
import { setTheme } from 'ngx-bootstrap/utils';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AddUserComponent } from './add-user/add-user.component';
var ngxUiLoaderConfig = {
    "bgsColor": "#5e72e4",
    "bgsOpacity": 1,
    "bgsPosition": "bottom-right",
    "bgsSize": 60,
    "bgsType": "three-strings",
    "blur": 100,
    "fgsColor": "#5e72e4",
    "fgsPosition": "center-center",
    "fgsSize": 80,
    "fgsType": "three-strings",
    "gap": 24,
    "logoPosition": "center-center",
    "logoSize": 120,
    "logoUrl": "",
    "masterLoaderId": "master",
    "overlayBorderRadius": "0",
    "overlayColor": "rgba(40, 40, 40, 0.8)",
    "pbColor": "#5e72e4",
    "pbDirection": "ltr",
    "pbThickness": 3,
    "hasProgressBar": true,
    "text": "",
    "textColor": "#FFFFFF",
    "textPosition": "center-center",
};
setTheme('bs4'); // or 'bs4'
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                AppComponent,
                DashboardComponent,
                LogsSummaryComponent,
                UserProfileComponent,
                LoginComponent,
                FilterPipe,
                AllUsersComponent,
                UserDetailComponent,
                TestingDatepickerComponent,
                UserReportComponent,
                EditProfileComponent,
                AddUserComponent,
            ],
            imports: [
                BrowserModule,
                AppRoutingModule,
                HttpClientModule,
                FormsModule,
                ReactiveFormsModule,
                NgxPaginationModule,
                NgSelectModule,
                BsDatepickerModule.forRoot(),
                DatepickerModule.forRoot(),
                BrowserAnimationsModule,
                NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
            ],
            providers: [],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map