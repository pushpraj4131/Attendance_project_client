import { TestBed } from '@angular/core/testing';
import { LogsService } from './logs.service';
describe('LogsService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(LogsService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=logs.service.spec.js.map