import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
var AuthGuard = /** @class */ (function () {
    function AuthGuard() {
    }
    AuthGuard.prototype.canActivate = function (next, state) {
        if (JSON.parse(localStorage.getItem('currentUser')).userRole === 'admin') {
            return true;
        }
        return false;
    };
    AuthGuard = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], AuthGuard);
    return AuthGuard;
}());
export { AuthGuard };
// export class loginGaurd implements CanActivate {
// 	constructor(private _router: Router){
// 	}
//   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
//   	var isLoggedIn = JSON.parse(localStorage.getItem('currentUser'));
//   	if(isLoggedIn){
//   		return true;
//   	}
//   	this._router.navigate(['login']);
//   	return false;
//   }
// }
//# sourceMappingURL=auth.guard.js.map