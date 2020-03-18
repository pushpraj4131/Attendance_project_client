import { async, TestBed } from '@angular/core/testing';
import { TestingDatepickerComponent } from './testing-datepicker.component';
describe('TestingDatepickerComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [TestingDatepickerComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(TestingDatepickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=testing-datepicker.component.spec.js.map