import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Profile {
  id: string;
  iccid: string;
  status: string;
  carrier: string;
  msisdn: string;
}

interface ProfileState {
  profiles: Profile[];
  selectedCarrier: string | null;
  loading: boolean;
}

const initialState: ProfileState = {
  profiles: [],
  selectedCarrier: null,
  loading: false,
};

const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    setProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = action.payload;
    },
    setSelectedCarrier: (state, action: PayloadAction<string | null>) => {
      state.selectedCarrier = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProfiles, setSelectedCarrier, setLoading } = profileSlice.actions;
export default profileSlice.reducer;