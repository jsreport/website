"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round = exports.interpolate = void 0;
const vm = require('vm');
const interpolate = (tmpl, vars) => {
    const r = vm.runInNewContext('`' + tmpl + '`', vars);
    // do it twice to support nested ${}
    return vm.runInNewContext('`' + r + '`', vars);
};
exports.interpolate = interpolate;
const round = (value) => {
    return Number(Math.round((value + 'e' + 2)) + 'e-' + 2);
};
exports.round = round;
//# sourceMappingURL=utils.js.map