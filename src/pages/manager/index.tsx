import useLoading from "@/hooks/useLoading";
import useUser from "@/hooks/useUser";
import EthersService from "@/utils/ethers";
import { useEffect, useState } from "react";
import Logo from "@/assets/images/logo.png";
import { SlLogout } from "react-icons/sl";
import { Navigate } from "react-router-dom";
import useWallet from "@/hooks/useWallet";
import toast from "react-hot-toast";

const Page: React.FC<any> = () => {
  const [question, setQuestion] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { setLoading } = useLoading();

  const { setUser, user } = useUser();

  const { getSigner } = useWallet();

  useEffect(() => {
    setLoading(true);
    const etherService = new EthersService();
    etherService.getQuestions().then((res) => {
      const is_question_asked = res?.some((e: any) => e.is_available);
      setUser({
        ...user,
        is_question_asked,
      });
      setLoading(false);
    });
  }, []);

  const handleStart = () => {
    setLoading(true);
    const etherService = new EthersService();
    const signer = getSigner();
    etherService
      .askQuestion(question, description, signer, () => setLoading(false))
      .then((hash) => {
        toast("transaction hash " + hash.slice(0, 4) + "..." + hash.slice(-4));
        setLoading(false);
      });
  };

  if (user?.is_question_asked) {
    return <Navigate to={"/answer"} />;
  }

  return (
    <div className="flex flex-col items-center w-[80%] mx-auto gap-y-[24px] h-full py-[32px]">
      <button
        onClick={() => {
          setUser(null);
        }}
        className="self-start flex items-center gap-x-[12px] text-red-400 bg-red-200 bg-opacity-10 px-3 py-2 rounded-sm "
      >
        <SlLogout />{" "}
      </button>
      <img
        className="w-[120px]"
        // @ts-ignore
        src={Logo}
      />
      <div className="text-center font-bold">Oylama</div>
      <div className="w-full overflow-auto self-stretch  flex-1">
        <label className="text-xs">Başlık</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border-2 w-full mt-1 mb-5 outline-none p-[12px] text-xs"
          rows={5}
        />
        <label className="text-xs">Açıklama</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-2 w-full mt-1 mb-5 outline-none p-[12px] text-xs"
          rows={5}
        />
      </div>
      {question && (
        <button
          onClick={handleStart}
          className="bg-green-400 bg-opacity-20 w-full text-green-600 py-2"
        >
          Toplantıyı Başlat
        </button>
      )}
    </div>
  );
};

export default Page;
