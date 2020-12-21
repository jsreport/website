const vm = require('vm')

export const interpolate = (tmpl, vars) => {
    return vm.runInNewContext('`' + tmpl + '`', vars)
}

export const round = (value) => {
    return Number(Math.round(<any>(value + 'e' + 2)) + 'e-' + 2)
}