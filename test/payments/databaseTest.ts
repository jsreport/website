import { MongoClient, Db } from 'mongodb'
import * as logger from '../../src/lib/utils/logger'

logger.init()

export default function (fn: (f: () => Db) => void) {
    describe('database', () => {
        let dbClient: MongoClient
        let db: Db

        before(async () => {
            const Client = new MongoClient('mongodb://localhost:27017/test', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            dbClient = await Client.connect()
            db = dbClient.db()
        })

        beforeEach(async () => {
            return db.dropDatabase()
        })

        after(() => {
            dbClient.close()
        })

        fn(() => db)
    })
}
