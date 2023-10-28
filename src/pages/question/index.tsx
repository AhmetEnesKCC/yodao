import { useCallback, useEffect } from "react";
import useUser from "@/hooks/useUser";
import EthersService from "@/utils/ethers";
import useLoading from "@/hooks/useLoading";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Page = () => {
  const { user, setUser } = useUser();

  const { setLoading } = useLoading();

  const navigate = useNavigate();

  const getHolder = useCallback(async () => {
    const etherService = new EthersService();
    const balance = await etherService.getBalance(user?.address);
    if (balance === 0) {
      toast("Yeterli bakiyeniz yok");
    }
    etherService
      .getHolder(user?.address)
      .then((res) => {
        setLoading(false);
        setUser({ ...user, holder: res });
        if (res?.is_director) {
          navigate("/manager");
        } else {
          navigate("/answer");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    setLoading(true);
    getHolder();
  }, []);

  return <></>;
};

export default Page;
