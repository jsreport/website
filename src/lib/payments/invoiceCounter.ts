import { Db } from 'mongodb'

export default function (db: Db) {
    return async function () {
        await db.collection('invoiceCounter').updateOne(
            {},
            {
                $inc: {
                    nextId: 1
                }
            }
        )
        let counter = await db.collection('invoiceCounter').findOne({})
        if (counter == null) {
            counter = { nextId: 1 }
        }

        return `${new Date().getFullYear()}-${counter.nextId}B`
    }
}