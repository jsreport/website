"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round = exports.interpolate = void 0;
const vm = require('vm');
const interpolate = (tmpl, vars) => {
    return vm.runInNewContext('`' + tmpl + '`', vars);
};
exports.interpolate = interpolate;
const round = (value) => {
    return Number(Math.round((value + 'e' + 2)) + 'e-' + 2);
};
exports.round = round;
//# sourceMappingURL=utils.js.map