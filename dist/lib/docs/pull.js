"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const isomorphic_git_1 = __importDefault(require("isomorphic-git"));
const node_1 = __importDefault(require("isomorphic-git/http/node"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const version_sort_1 = __importDefault(require("version-sort"));
const tmpRepoDir = path_1.default.join(os_1.default.tmpdir(), 'jsreport', 'temp', 'docsRepo');
async function pull(docsPath = 'views/learn/docs') {
    // return ['latest', '3.0.0']
    fs_1.default.rmdirSync(tmpRepoDir, { recursive: true });
    fs_1.default.mkdirSync(tmpRepoDir, { recursive: true });
    const fullDocsPath = path_1.default.isAbsolute(docsPath) ? docsPath : path_1.default.join(process_1.default.cwd(), docsPath);
    fs_1.default.rmdirSync(fullDocsPath, { recursive: true });
    fs_1.default.mkdirSync(fullDocsPath, { recursive: true });
    await isomorphic_git_1.default.clone({ fs: fs_1.default, http: node_1.default, dir: tmpRepoDir, url: 'https://github.com/jsreport/docs' });
    await fs_extra_1.default.copy(tmpRepoDir, path_1.default.join(fullDocsPath, 'latest'));
    const branches = (await isomorphic_git_1.default.listBranches({ fs: fs_1.default, dir: tmpRepoDir, remote: 'origin' })).filter(b => b !== 'master' && b !== 'HEAD');
    for (const branch of branches) {
        await isomorphic_git_1.default.checkout({
            fs: fs_1.default,
            dir: tmpRepoDir,
            ref: branch
        });
        await fs_extra_1.default.copy(tmpRepoDir, path_1.default.join(fullDocsPath, branch));
    }
    return ['latest', ...[...version_sort_1.default(branches)].reverse()];
}
exports.default = pull;
//# sourceMappingURL=pull.js.map