import useUser from "@/hooks/useUser";
import useWallet from "@/hooks/useWallet";
import EthersService from "@/utils/ethers";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SlLogout, SlQuestion } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/images/logo.png";
import WebexIcon from "@/assets/images/webex.png";
import {} from "react-icons/tb";
import LottieReact from "lottie-react";
import YodaAnimation from "@/assets/yoda.json";

const Page = () => {
  const [question, setQuestion] = useState<Record<string, any>>({});

  const { user, logout } = useUser();

  useEffect(() => {
    const etherService = new EthersService();
    etherService.getQuestions().then((res) => {
      const q = res?.find((e: any) => e.is_available);
      if (!q) {
        if (user?.holder?.is_director) {
          toast("Soru oluşturma ekranına yönlendiriliyorsunuz");
          setTimeout(() => {
            navigate("/manager");
          }, 1000);
        } else {
          toast("Soru olmadığı için çıkış yapılıyor");
          setTimeout(() => {
            logout();
          }, 1000);
        }
      } else {
        setQuestion(q);
      }
    });
  }, []);

  const { getSigner } = useWallet();

  const navigate = useNavigate();

  const { setUser } = useUser();
  const [reason, setReason] = useState<string>("");
  const [answer, setAnswer] = useState<"no" | "yes" | null>(null);

  const handleAnswer = async () => {
    if (answer) {
      const etherService = new EthersService();
      const signer = getSigner();
      const promise = etherService.answerQuestion(
        question.id,
        answer === "yes",
        signer,
        reason
      );

      toast
        .promise(promise, {
          loading: "Cevabınız gönderiliyor",
          error: (res) => {
            if (res?.toString()?.includes("has already answered")) {
              return "Daha önce cevapladınız";
            } else {
              return "Cevabınız gönderilemedi";
            }
          },
          success: (hash) => {
            toast(
              "transaction hash " + hash.slice(0, 4) + "..." + hash.slice(-4)
            );

            return "Cevabınız gönderildi";
          },
        })
        .finally(() => {
          setTimeout(() => {
            toast("Yeniden yönlendiriliyorsunuz");
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }, 1000);
        });
    } else {
      toast("Lütfen cevap seçin");
    }
  };

  if (Object.keys(question).length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-y-[12px] h-full py-3 overflow-auto">
      <div className="justify-between w-full flex">
        <button
          onClick={() => {
            setUser(null);
          }}
          className="self-start flex items-center gap-x-[12px] text-red-400 bg-red-200 bg-opacity-10 px-3 py-2 rounded-sm "
        >
          <SlLogout />{" "}
        </button>
        <button
          onClick={() => {
            toast.dismiss();
            toast("Çok yakında");
          }}
          className="self-end flex flex-col items-center gap-x-[12px]   bg-opacity-10 px-3 py-2 rounded-sm shadow-md rounded-md"
        >
          <h5 className="text-blue-600 text-xs mb-2">Webex ile bağlan</h5>
          <img
            className="w-[24px]  rounded-full"
            // @ts-ignore
            src={WebexIcon}
          />
        </button>
      </div>
      <img
        className="w-[120px] mx-auto"
        // @ts-ignore
        src={Logo}
      />
      <div
        onClick={() => {
          toast.dismiss();
          toast("Çok yakında");
        }}
        className="cursor-pointer rounded-md flex items-center justify-center gap-x-[12px] bg-green-200 py-2"
      >
        <div className="w-[60px]">
          <LottieReact animationData={YodaAnimation} />
        </div>
        <div>Yapay zekaya danış</div>
      </div>
      <h3 className="flex justify-between gap-x-[12px]">
        <span>Toplam Cevap</span> {parseInt(question.total_answers?._hex)}
      </h3>
      <h3 className="flex justify-between gap-x-[12px]">
        <span>Pozitif Ağırlık</span> {parseInt(question.positive_weight?._hex)}
      </h3>
      <h3 className="flex justify-between gap-x-[12px]">
        <span>Negatif Ağırlık</span>
        {parseInt(question.negative_weight?._hex)}
      </h3>
      <div className="mt-[24px] mb-[12px]">
        <h4 className="text-center mb-[12px]">Oylama</h4>
        <h3 className="shadow px-2 py-1 flex items-center gap-x-2">
          <SlQuestion className="text-blue-800" />
          {question.value}
        </h3>
        {question.description && (
          <>
            <h4 className="text-center mb-[12px] mt-[24px]">
              Oylama Açıklaması
            </h4>
            <h5 className="shadow-md p-2">{question.description ?? ""}</h5>
          </>
        )}
      </div>
      <fieldset
        className="mb-[12px]"
        onChange={(e: any) => {
          setAnswer(e.target.value as typeof answer);
        }}
      >
        <legend className="mb-[12px] text-center">Cevap seçin</legend>
        <div className="flex flex-col">
          <div className="flex items-center gap-x-[20px] bg-green-500 px-2 bg-opacity-10  mb-[12px]">
            <input type="radio" id="choice1" name="answer" value="yes" />
            <label htmlFor="choice1" className="w-full p-2">
              Onayla
            </label>
          </div>
          <div className="flex items-center gap-x-[20px] px-2 bg-red-500 bg-opacity-10 mb-[12px]">
            <input type="radio" id="choice2" name="answer" value="no" />
            <label htmlFor="choice2" className="w-full p-2">
              Reddet
            </label>
          </div>
          <div className="flex items-center gap-x-[20px] px-2 bg-purple-500 bg-opacity-10">
            <input type="radio" id="choice2" name="answer" value="no" />
            <label htmlFor="choice2" className="w-full p-2">
              İhtirazi kayıt ile onayla
            </label>
          </div>
        </div>
      </fieldset>
      {answer !== "yes" && (
        <textarea
          className="border-2 p-2 outline-none"
          rows={3}
          placeholder="Muhalefet Şerhi"
          style={{
            resize: "none",
            minHeight: "100px",
          }}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>
      )}
      <button
        onClick={handleAnswer}
        disabled={(!answer || !reason) && answer !== "yes" && !reason}
        className="bg-green-400 disabled:bg-gray-300 w-full py-2 transition duration-300"
      >
        Kararını gönder ve imzala
      </button>
    </div>
  );
};

export default Page;
