import pull from '../src/lib/docs/pull'
import os from 'os'
import path from 'path'
import fs from 'fs'

describe.only('docs pull', () => {
    const testDir = path.join(os.tmpdir(), 'jsreport', 'test')
    beforeEach(() => {
        fs.rmdirSync(testDir, {
            recursive: true
        })
        fs.mkdirSync(testDir, { recursive: true })
    })

    it('subscription', async () => {
        await pull(testDir)
        fs.existsSync(path.join(testDir, 'latest', 'README.md'))
        fs.existsSync(path.join(testDir, '1.0.0', 'README.md'))
    })
})