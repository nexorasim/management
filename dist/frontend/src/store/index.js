"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const profileSlice_1 = require("./profileSlice");
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        profiles: profileSlice_1.default,
    },
});
//# sourceMappingURL=index.js.map