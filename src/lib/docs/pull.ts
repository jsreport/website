import path from 'path'
import process from 'process'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'
import os from 'os'
import fsExtra from 'fs-extra'
import versionSort from 'version-sort'
import * as logger from '../utils/logger'

const tmpRepoDir = path.join(os.tmpdir(), 'jsreport', 'temp', 'docsRepo')

export default async function pull(docsPath = 'views/learn/docs') {
    // return ['latest', '2.11.0']
    fs.rmdirSync(tmpRepoDir, { recursive: true })
    fs.mkdirSync(tmpRepoDir, { recursive: true })

    const fullDocsPath = path.isAbsolute(docsPath) ? docsPath : path.join(process.cwd(), docsPath)
    fs.rmdirSync(fullDocsPath, { recursive: true })
    fs.mkdirSync(fullDocsPath, { recursive: true })

    logger.info('git clone docs')
    await git.clone({ fs, http, dir: tmpRepoDir, url: 'https://github.com/jsreport/docs' })
    await fsExtra.copy(tmpRepoDir, path.join(fullDocsPath, 'latest'))
    const branches = (await git.listBranches({ fs, dir: tmpRepoDir, remote: 'origin' })).filter(b => b !== 'master' && b !== 'HEAD')
    logger.info('git checkout docs')
    for (const branch of branches) {
        await git.checkout({
            fs,
            dir: tmpRepoDir,
            ref: branch
        })
        await fsExtra.copy(tmpRepoDir, path.join(fullDocsPath, branch))
    }

    return ['latest', ...[...versionSort(branches)].reverse()]
}