import { async, TestBed } from '@angular/core/testing';
import { LogsSummaryComponent } from './logs-summary.component';
describe('LogsSummaryComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [LogsSummaryComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(LogsSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=logs-summary.component.spec.js.map