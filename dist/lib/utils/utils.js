"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vm = require('vm');
exports.interpolate = (tmpl, vars) => {
    return vm.runInNewContext('`' + tmpl + '`', vars);
};
exports.round = (value) => {
    return Number(Math.round((value + 'e' + 2)) + 'e-' + 2);
};
//# sourceMappingURL=utils.js.map