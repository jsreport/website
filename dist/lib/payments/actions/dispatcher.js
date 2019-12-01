"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DispatchContext {
    constructor(services, dispatcher) {
        this.services = services;
        this.dispatcher = dispatcher;
    }
}
exports.DispatchContext = DispatchContext;
class Dispatcher {
    dispatch(fn, context, ...args) {
        return fn(context, ...args);
    }
}
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=dispatcher.js.map