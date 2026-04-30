'use client';

import { Wallet } from '@/types';

interface WalletBalanceProps {
  wallet: Wallet;
}

export function WalletBalance({ wallet }: WalletBalanceProps) {
  return (
    <div className="bg-gradient-to-br from-sage-500 to-sage-600 text-white rounded-2xl p-8 mb-8">
      <div className="mb-6">
        <p className="text-sage-100 text-sm mb-1">Your Balance</p>
        <h2 className="text-4xl font-cormorant font-semibold">
          {wallet.currency} {wallet.balance.toFixed(2)}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-sage-400">
        <div>
          <p className="text-sage-100 text-xs mb-1">Total Earned</p>
          <p className="text-xl font-semibold">${wallet.totalEarned.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sage-100 text-xs mb-1">Available</p>
          <p className="text-xl font-semibold">${wallet.balance.toFixed(2)}</p>
        </div>
      </div>

      <button className="w-full mt-6 bg-white text-sage-600 font-medium py-2 rounded-full hover:bg-sage-50 transition-colors">
        Withdraw
      </button>
    </div>
  );
}
