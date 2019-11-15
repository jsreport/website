"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(db) {
    return async function () {
        await db.collection('invoiceCounter').updateOne({}, {
            $inc: {
                nextId: 1
            }
        });
        let counter = await db.collection('invoiceCounter').findOne({});
        if (counter == null) {
            counter = { nextId: 1 };
        }
        return `${new Date().getFullYear()}-${counter.nextId}B`;
    };
}
exports.default = default_1;
//# sourceMappingURL=invoiceCounter.js.map