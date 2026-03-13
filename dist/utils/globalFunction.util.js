"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function capitalizeFirstLetter(string) {
    if (!string)
        return '';
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
//# sourceMappingURL=globalFunction.util.js.map