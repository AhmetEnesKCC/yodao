import Logo from "@/assets/images/logo.png";
import useUser from "@/hooks/useUser";
import useWallet from "@/hooks/useWallet";
import { Navigate } from "react-router-dom";

const Page = () => {
  const { connectwalletHandler } = useWallet();
  const { user } = useUser();
  if (user) {
    return <Navigate to={"/main"} />;
  }
  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="items-center justify-center flex flex-col flex-1 ">
        <img
          className="w-[120px]"
          // @ts-ignore
          src={Logo}
        />

        <h5 className="font-bold text-xl  text-maingreen mt-[12px]">YODAO</h5>
        <div>
          <h3 className="text-maingreen text-xs">
            may the justice be with you
          </h3>
        </div>
      </div>
      <div className="flex-1 flex items-start justify-center w-full">
        <div className="flex flex-col w-full items-center">
          {/* <input
            placeholder="Cüzdan Adresi"
            className="border-2 w-[80%] border-b-transparent text-xs rounded-t-md h-[60px] outline-none px-[12px]"
          /> */}
          <button onClick={connectwalletHandler} className="login-button">
            Giriş yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
