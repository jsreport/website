"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mjml_1 = __importDefault(require("mjml"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils/utils");
const subjects = {};
async function default_1(type, subtype, us, email, data) {
    const content = await fs_1.promises.readFile(path_1.default.join(__dirname, 'emails', type + '.mjml'));
    return {
        subject: subjects[type][subtype],
        email,
        content: mjml_1.default(utils_1.interpolate(content, data))
    };
}
exports.default = default_1;
//# sourceMappingURL=emailRender.js.map