"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vm = require('vm');
exports.interpolate = (tmpl, vars) => {
    return vm.runInNewContext('`' + tmpl + '`', vars);
};
//# sourceMappingURL=utils.js.map