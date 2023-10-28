import { ethers } from "ethers";

import DaoData from "@/Dao.json";

class EthersService {
  private abi;
  private privateKey;
  private providerURL;
  private provider;
  private wallet;
  private contractAddress;

  constructor() {
    this.abi = DaoData.abi;
    this.privateKey = import.meta.env.VITE_PUBLIC_PRIVATE_KEY;
    this.providerURL = import.meta.env.VITE_PUBLIC_PROVIDER_URL;
    this.provider = new ethers.providers.JsonRpcProvider(this.providerURL);
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);
    this.contractAddress = import.meta.env.VITE_PUBLIC_CONTRACT_ADDRESS;
  }
  public createPoolContract = async () => {
    if (!this.contractAddress) {
      const err = new Error("Pool contract is undefined");
      throw { err, statusCode: 500 };
    }
    const poolContract = new ethers.Contract(
      this.contractAddress,
      this.abi,
      this.wallet
    );
    return poolContract;
  };

  public askQuestion = async (
    question: string,
    description: string,
    user_address: any,
    onError: () => void
  ) => {
    const poolContract = await this.createPoolContract();

    try {
      const tx = await poolContract
        .connect(user_address)
        .ask_question(question, description);
      await tx.wait();
      return tx.hash;
    } catch (err) {
      if (err) {
        onError();
      }
      throw err;
    }
  };
  public answerQuestion = async (
    questionId: number,
    answer: boolean,
    holderAddress: any,
    reason?: string
  ) => {
    const poolContract = await this.createPoolContract();
    try {
      const tx = await poolContract
        .connect(holderAddress)
        .answer_question(questionId, answer, reason);
      await tx.wait();
      return tx.hash;
    } catch (err) {
      throw err;
    }
  };

  public getHolder = async (holderAddress: string) => {
    const poolContract = await this.createPoolContract();
    try {
      const holder = await poolContract.getHolder(holderAddress);
      return holder;
    } catch (err) {
      throw err;
    }
  };

  public getQuestions = async () => {
    const poolContract = await this.createPoolContract();
    try {
      const questions = await poolContract.getQuestions();
      return questions;
    } catch (err) {
      throw err;
    }
  };
  public getBalance = async (wallet_address: any) => {
    try {
      const balanceWei = await this.provider.getBalance(wallet_address);
      const balanceEth = Number(ethers.utils.formatEther(balanceWei));
      return balanceEth;
    } catch (err) {
      throw err;
    }
  };
}

export default EthersService;
