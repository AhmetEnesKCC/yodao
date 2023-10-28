import { ethers } from "ethers";
import toast from "react-hot-toast";
import useUser from "./useUser";

const useWallet = () => {
  const { setUser } = useUser();

  const getSigner = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getSigner();
  };

  const connectwalletHandler = () => {
    if (!window.ethereum) {
      return toast("Lütfen Metamask'ı yükleyin");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    if (window.ethereum) {
      provider.send("eth_requestAccounts", []).then(async () => {
        await accountChangedHandler(provider.getSigner());
      });
    } else {
      toast("Lütfen Metamask'ı yükleyin");
    }
  };
  const accountChangedHandler = async (newAccount: any) => {
    if (!window.ethereum) {
      return toast("Lütfen Metamask'ı yükleyin");
    }
    const address = await newAccount.getAddress();
    setUser({ address });
  };

  return { connectwalletHandler, getSigner };
};

export default useWallet;
