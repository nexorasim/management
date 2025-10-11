"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLoading = exports.setSelectedCarrier = exports.setProfiles = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    profiles: [],
    selectedCarrier: null,
    loading: false,
};
const profileSlice = (0, toolkit_1.createSlice)({
    name: 'profiles',
    initialState,
    reducers: {
        setProfiles: (state, action) => {
            state.profiles = action.payload;
        },
        setSelectedCarrier: (state, action) => {
            state.selectedCarrier = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});
_a = profileSlice.actions, exports.setProfiles = _a.setProfiles, exports.setSelectedCarrier = _a.setSelectedCarrier, exports.setLoading = _a.setLoading;
exports.default = profileSlice.reducer;
//# sourceMappingURL=profileSlice.js.map