import { BankRepository } from "./bank.repository";

const bankRepository = new BankRepository();

export class BankService {
  async getBanks() {
    return bankRepository.getBanks();
  }

  async getBank(id: string) {
    return bankRepository.getBankById(id);
  }

  async createBank(data: any) {
    return bankRepository.createBank({
      id: crypto.randomUUID(),
      bankName: data.bankName,
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      ifsc: data.ifsc,
      branch: data.branch,
      upiId: data.upiId,
    });
  }

  async updateBank(id: string, data: any) {
    return bankRepository.updateBank(id, {
      bankName: data.bankName,
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      ifsc: data.ifsc,
      branch: data.branch,
      upiId: data.upiId,
    });
  }

  async deleteBank(id: string) {
    return bankRepository.deleteBank(id);
  }
}