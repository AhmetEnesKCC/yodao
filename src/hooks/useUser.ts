import { create } from "zustand";

interface UserStateType {
  user: null | Record<string, any>;
  setUser: (user: null | Record<string, any>) => void;
  logout: () => void;
}

const useUser = create<UserStateType>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  logout: () => {
    localStorage.removeItem("user");
    set(() => ({ user: null }));
  },
}));

export const subscribeUser = (cb: any) => useUser.subscribe(cb);

export default useUser;
