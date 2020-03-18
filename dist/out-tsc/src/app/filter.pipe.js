import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
var FilterPipe = /** @class */ (function () {
    function FilterPipe() {
    }
    FilterPipe.prototype.transform = function (items, searchText) {
        if (!items)
            return [];
        if (!searchText)
            return items;
        console.log("ssearchText ==>", searchText);
        searchText = searchText.toLowerCase();
        console.log(items, searchText);
        return items.filter(function (it) {
            console.log(it);
            if (it.user)
                return it.user[0].name.toLowerCase().includes(searchText);
            else
                return it.name.toLowerCase().includes(searchText);
        });
    };
    FilterPipe = __decorate([
        Pipe({
            name: 'filter'
        })
    ], FilterPipe);
    return FilterPipe;
}());
export { FilterPipe };
//# sourceMappingURL=filter.pipe.js.map