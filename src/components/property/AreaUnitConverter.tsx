import React, { useState } from 'react';
import { AreaUnit } from '../../types/property';
import { convertToSqFt, convertFromSqFt } from '../../utils/formatters';
import { Calculator, ArrowRightLeft } from 'lucide-react';

export const AreaUnitConverter: React.FC<{ initialValue?: number; initialUnit?: AreaUnit }> = ({
  initialValue = 10,
  initialUnit = 'Marla',
}) => {
  const [val, setVal] = useState<number>(initialValue);
  const [sourceUnit, setSourceUnit] = useState<AreaUnit>(initialUnit);

  const sqFt = convertToSqFt(val || 0, sourceUnit);

  const marla = convertFromSqFt(sqFt, 'Marla');
  const kanal = convertFromSqFt(sqFt, 'Kanal');
  const sqYd = convertFromSqFt(sqFt, 'Sq. Yd');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Pakistan Land Area Converter</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Area Value
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={val || ''}
            onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Input Unit
          </label>
          <select
            value={sourceUnit}
            onChange={(e) => setSourceUnit(e.target.value as AreaUnit)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="Marla">Marla (225 sq ft)</option>
            <option value="Kanal">Kanal (20 Marla)</option>
            <option value="Sq. Yd">Square Yard / Gaz (9 sq ft)</option>
            <option value="Sq. Ft">Square Feet</option>
          </select>
        </div>
      </div>

      {/* Converted Equivalent Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Marla</span>
          <span className="font-bold text-slate-900 font-mono tabular-nums">
            {marla.toFixed(2).replace(/\.?0+$/, '')}
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Kanal</span>
          <span className="font-bold text-slate-900 font-mono tabular-nums">
            {kanal.toFixed(2).replace(/\.?0+$/, '')}
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Sq. Yards (Gaz)</span>
          <span className="font-bold text-slate-900 font-mono tabular-nums">
            {sqYd.toFixed(1).replace(/\.?0+$/, '')}
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Square Feet</span>
          <span className="font-bold text-emerald-800 font-mono tabular-nums">
            {sqFt.toLocaleString('en-PK')}
          </span>
        </div>
      </div>
    </div>
  );
};
