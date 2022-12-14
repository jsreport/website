const vm = require('vm')

export const interpolate = (tmpl, vars) => {
    const r = vm.runInNewContext('`' + tmpl + '`', vars)
    // do it twice to support nested ${}
    return vm.runInNewContext('`' + r + '`', vars)
}

export const round = (value) => {
    return Number(Math.round(<any>(value + 'e' + 2)) + 'e-' + 2)
}