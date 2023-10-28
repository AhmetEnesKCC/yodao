import { create } from "zustand";

interface LoadingStateType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useLoading = create<LoadingStateType>((set) => ({
  loading: false,
  setLoading: (loading) => set(() => ({ loading })),
}));

export default useLoading;
