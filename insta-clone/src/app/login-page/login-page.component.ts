import { Component } from "@angular/core";
import { SendHttpRequestService } from "./../send-http-request.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login-page',
    styleUrls: ['login-page.component.scss'],
    templateUrl: 'login-page.component.html'
})
export class LoginPageComponent {
    constructor(
        private sendReq: SendHttpRequestService,
        private _router: Router
    ) { }

    res: any;
    warningText: string;
    warning: boolean = false;
    ngOnInit() {
        let token = localStorage.getItem("token");
        if (!token) {
            this._router.navigate(["/login"]);
        } else {
            this._router.navigate(["/feed"]);
        }
    }
    loginFunction(userObj) {
        this.sendReq.logMeIn(userObj).subscribe(res => {
            if (res.status == 200) {
                localStorage.setItem("token", `${res.body.token}`);
                this._router.navigate(["/feed"]);
            } else if (res.status == 401) {
                this.warningText = res.error.message;
                this.warning = true;
            }
        });
    }
}