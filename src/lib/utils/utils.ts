const vm = require('vm')

export const interpolate = (tmpl, vars) => {
    return vm.runInNewContext('`' + tmpl + '`', vars)
}
