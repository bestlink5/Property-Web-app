import React, { useState } from 'react';
import { formatPKR, formatFullPKR } from '../../utils/formatters';
import { Calculator, Percent, Landmark } from 'lucide-react';

export const MortgageCalculator: React.FC<{ initialPrice?: number }> = ({
  initialPrice = 25000000,
}) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [annualRate, setAnnualRate] = useState<number>(16.5); // standard KIBOR-linked rate

  const downPayment = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = Math.max(0, propertyPrice - downPayment);

  // Monthly installment formula
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  let monthlyInstallment = 0;
  if (monthlyRate > 0 && totalMonths > 0 && loanAmount > 0) {
    monthlyInstallment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalPayment = monthlyInstallment * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <Landmark className="w-3.5 h-3.5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Home Financing / Bank Loan Estimator</h3>
          <p className="text-[11px] text-slate-500">KIBOR-based Islamic / Commercial bank finance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Property Price */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Property Price (PKR)
          </label>
          <input
            type="number"
            step="100000"
            value={propertyPrice || ''}
            onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
          <span className="text-[10px] text-emerald-800 mt-1 block">
            {formatPKR(propertyPrice)}
          </span>
        </div>

        {/* Down Payment % */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Down Payment ({downPaymentPercent}%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="flex-1 accent-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-slate-700 w-10 text-right">
              {downPaymentPercent}%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block font-mono">
            {formatPKR(downPayment)}
          </span>
        </div>

        {/* Tenure Years */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Loan Tenure: {tenureYears} Years
          </label>
          <div className="flex items-center gap-1.5">
            {[5, 10, 15, 20].map((yr) => (
              <button
                key={yr}
                onClick={() => setTenureYears(yr)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded border cursor-pointer ${
                  tenureYears === yr
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {yr}y
              </button>
            ))}
          </div>
        </div>

        {/* Markup Rate */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Bank Markup Rate (% p.a.)
          </label>
          <input
            type="number"
            step="0.5"
            min="5"
            max="30"
            value={annualRate}
            onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Result Strip */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs text-emerald-900 block font-medium">Estimated Monthly Installment</span>
          <span className="text-xl font-extrabold text-emerald-900 font-mono tabular-nums">
            {formatFullPKR(Math.round(monthlyInstallment))}
          </span>
          <span className="text-[10px] text-emerald-700 block">/ month for {tenureYears} years</span>
        </div>

        <div className="text-right text-xs text-slate-600">
          <div>
            <span className="text-slate-500">Loan Amount: </span>
            <span className="font-semibold text-slate-900">{formatPKR(loanAmount)}</span>
          </div>
          <div>
            <span className="text-slate-500">Total Markup: </span>
            <span className="font-semibold text-slate-900">{formatPKR(Math.round(totalInterest))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
