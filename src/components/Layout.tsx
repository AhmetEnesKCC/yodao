import useLoading from "@/hooks/useLoading";
import useUser, { subscribeUser } from "@/hooks/useUser";
import { PropsWithChildren, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { CircleLoader } from "react-spinners";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { loading } = useLoading();

  const { setUser } = useUser();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user") ?? ""));
    }
    subscribeUser((state: any) => {
      const is_director = state?.user?.holder?.is_director;
      if ([false, true].includes(is_director)) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            address: state?.user?.address,
            holder: {
              is_director: state?.user?.holder?.is_director,
            },
            is_question_asked: state?.user?.is_question_asked,
          })
        );
      }
    });
  }, []);

  return (
    <div className="w-[400px] relative bg-white mx-auto max-w-screen shadow-md h-[100dvh] overflow-hidden px-[12px] py-[20px]">
      <Toaster />
      {loading && (
        <div className="absolute top-0 left-0 w-full h-[100dvh] bg-white z-[99] flex items-center justify-center">
          <div className="flex flex-col items-center gap-y-[12px]">
            <CircleLoader />
            <div>Yükleniyor</div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Layout;
