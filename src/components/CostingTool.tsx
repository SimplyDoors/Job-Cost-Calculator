
import React, { useState } from 'react';
import { 
  Settings, 
  Package, 
  Truck, 
  Copy, 
  Check, 
  AlertCircle,
  DollarSign,
  TrendingUp,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import { useCostCalculator } from '../hooks/useCostCalculator';
import { productionAdders, componentAdders, dropShipAdders, typeLabels } from '../data/pricing';

// Custom SimplyDoors Logo Component
const SimplyDoorsLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Door Frame/Shape - Green */}
    <path d="M20 10H80V90H20V10Z" fill="#6CD958" />
    {/* Door details to make it look like the logo */}
    <path d="M25 15H75V85H25V15Z" fill="#6CD958" stroke="white" strokeWidth="2"/>
    <circle cx="65" cy="50" r="4" fill="white" />
    {/* Open door effect (perspective) - simplified */}
    <path d="M80 10L95 20V80L80 90V10Z" fill="#4EC23B" />
  </svg>
);

export const CostingTool: React.FC = () => {
  const { 
    state, 
    setField, 
    toggleAdder, 
    availableTypes, 
    availableWidths, 
    calculation 
  } = useCostCalculator();

  const [copiedCost, setCopiedCost] = useState(false);
  const [copiedPrice, setCopiedPrice] = useState(false);

  const handleCopy = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SimplyDoorsLogo />
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">
                SimplyDoors
              </h1>
              <p className="text-sm font-medium text-gray-500 tracking-wide">
                New Doors, Made Easy
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-50 rounded-full border border-brand-100">
              <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">System Live</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">Internal Tool</p>
              <p className="text-sm font-bold text-gray-900">Cost Calculator v3.2</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Margin Configuration */}
            <Card title="Margin Configuration" className="border-t-4 border-t-brand-400 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Target Gross Margin (%)</label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      className="block w-full rounded-lg border-gray-300 pr-12 focus:border-brand-400 focus:ring-brand-400 sm:text-sm py-2.5 font-semibold text-gray-900"
                      value={state.marginPercent}
                      onChange={(e) => setField('marginPercent', parseFloat(e.target.value) || 0)}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm font-bold">%</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Price = Cost / (1 - Margin%)
                  </p>
                </div>
                
                <div className="bg-gray-900 rounded-xl p-4 flex flex-col justify-center items-center text-center shadow-inner">
                  <span className="text-xs font-medium text-brand-300 uppercase tracking-wider">Markup Equivalent</span>
                  <span className="text-3xl font-black text-white mt-1">
                    {calculation.markup.toFixed(2)}x
                  </span>
                </div>
              </div>
            </Card>

            {/* 2. Slab Configuration */}
            <Card title="Slab Configuration" className="shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Style Family</label>
                  <select
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-400 focus:ring-brand-400 sm:text-sm py-2.5"
                    value={state.style}
                    onChange={(e) => setField('style', e.target.value)}
                  >
                    <optgroup label="Woodgrain (Standard)">
                      <option value="molded">Molded Raised Panel</option>
                      <option value="flushHB">Flush Hardboard (Primed)</option>
                      <option value="flushBirch">Flush Birch</option>
                    </optgroup>
                    <optgroup label="Simpson Redi-Prime (Primed)">
                      <option value="rp8720">#8720 Shaker 1-Panel (Primed)</option>
                      <option value="rp8782">#8782 Shaker 2-Panel (Primed)</option>
                      <option value="rp8730">#8730 Shaker 3-Panel Equal (Primed)</option>
                      <option value="rp8760">#8760 Craftsman 3-Panel (Primed)</option>
                      <option value="rp8755">#8755 Shaker 5-Panel (Primed)</option>
                    </optgroup>
                    <optgroup label="Simpson Rift White Oak (Premium)">
                      <option value="rift720">#720 Shaker 1-Panel (Rift Oak)</option>
                      <option value="rift782">#782 Shaker 2-Panel (Rift Oak)</option>
                      <option value="rift730">#730 Shaker 3-Panel (Rift Oak)</option>
                      <option value="rift755">#755 Shaker 5-Panel (Rift Oak)</option>
                      <option value="rift1501Clear">#1501 1-Lite Clear Ovolo (Rift Oak)</option>
                      <option value="rift1501Satin">#1501 1-Lite Satin Etch (Rift Oak)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Height</label>
                  <select
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-400 focus:ring-brand-400 sm:text-sm py-2.5"
                    value={state.height}
                    onChange={(e) => setField('height', e.target.value)}
                  >
                    <option value="68">6'8"</option>
                    <option value="70">7'0"</option>
                    <option value="80">8'0"</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Thickness & Core</label>
                  <select
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-400 focus:ring-brand-400 sm:text-sm py-2.5"
                    value={state.type}
                    onChange={(e) => setField('type', e.target.value)}
                  >
                    {availableTypes.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Purchasing Tier</label>
                  <select
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-400 focus:ring-brand-400 sm:text-sm py-2.5"
                    value={state.purchaseType}
                    onChange={(e) => setField('purchaseType', e.target.value as any)}
                  >
                    <option value="jobLot">Standard / Job Lot (Brkn Pallet)</option>
                    <option value="pallet">Warehouse Full Pallet</option>
                    <option value="drop">Drop / Container</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Size (Width)</label>
                  <select
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-400 focus:ring-brand-400 sm:text-sm py-2.5"
                    value={state.width}
                    onChange={(e) => setField('width', e.target.value)}
                  >
                    {availableWidths.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Base Cost Display */}
              <div className="mt-6 p-4 bg-brand-50 rounded-xl border border-brand-100 flex items-center justify-between">
                <span className="text-sm font-bold text-brand-900 uppercase tracking-wide">Base Slab Cost</span>
                {calculation.isValid ? (
                  <div className="text-right">
                    <span className="text-xl font-black text-brand-700">
                      {formatCurrency(calculation.baseCost)}
                    </span>
                    {calculation.slabCount > 1 && (
                      <span className="ml-2 text-sm font-medium text-brand-600">
                        x {calculation.slabCount} = {formatCurrency(calculation.totalSlabCost)}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    N/A for this configuration
                  </span>
                )}
              </div>

              {/* Drop Ship Adders */}
              <AnimatePresence>
                {state.purchaseType === 'drop' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-dashed border-gray-200 overflow-hidden"
                  >
                    <h4 className="text-sm font-bold text-orange-600 mb-3 flex items-center gap-2 uppercase tracking-wide">
                      <Truck className="h-4 w-4" />
                      Drop Shipment Fees
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {dropShipAdders.map((item) => (
                        <label 
                          key={item.name}
                          className={`
                            relative flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200
                            ${state.selectedDropShipAdders.includes(item.name) 
                              ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500 shadow-sm' 
                              : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}
                          `}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            checked={state.selectedDropShipAdders.includes(item.name)}
                            onChange={() => toggleAdder('selectedDropShipAdders', item.name)}
                          />
                          <div className="ml-3 flex-1">
                            <span className="block text-sm font-semibold text-gray-900">{item.name}</span>
                            <span className="block text-xs font-medium text-orange-600">+{formatCurrency(item.cost)}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* 3. Production Services */}
            <Card title="Production Services (Internal)" className="shadow-md">
              <div className="mb-4 text-xs font-medium text-gray-500 bg-gray-100 p-2 rounded-lg inline-flex items-center gap-2">
                <Info className="h-3 w-3" />
                Selecting a "Double" service automatically calculates cost for 2 slabs.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {productionAdders.map((item) => (
                  <label 
                    key={item.name}
                    className={`
                      relative flex items-start p-3 rounded-lg border cursor-pointer transition-all duration-200
                      ${state.selectedProductionAdders.includes(item.name) 
                        ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500 shadow-sm' 
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}
                    `}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                      checked={state.selectedProductionAdders.includes(item.name)}
                      onChange={() => toggleAdder('selectedProductionAdders', item.name)}
                    />
                    <div className="ml-3 flex-1">
                      <span className="block text-sm font-semibold text-gray-900 leading-tight mb-1">{item.name}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-white text-gray-700 border border-gray-200 shadow-sm">
                        +{formatCurrency(item.cost)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            {/* 4. Component Materials */}
            <Card title="Component Materials" className="shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {componentAdders.map((item) => (
                  <label 
                    key={item.name}
                    className={`
                      relative flex items-start p-3 rounded-lg border cursor-pointer transition-all duration-200
                      ${state.selectedComponentAdders.includes(item.name) 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm' 
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}
                    `}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={state.selectedComponentAdders.includes(item.name)}
                      onChange={() => toggleAdder('selectedComponentAdders', item.name)}
                    />
                    <div className="ml-3 flex-1">
                      <span className="block text-sm font-semibold text-gray-900 leading-tight mb-1">{item.name}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-white text-gray-700 border border-gray-200 shadow-sm">
                        +{formatCurrency(item.cost)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Results (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Main Result Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden ring-1 ring-black/5">
                <div className="bg-gray-900 px-6 py-5 border-b border-gray-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <SimplyDoorsLogo />
                  </div>
                  <h2 className="text-white font-bold text-lg flex items-center gap-2 relative z-10">
                    <DollarSign className="h-5 w-5 text-brand-400" />
                    Cost Summary
                  </h2>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Internal Cost */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Internal Cost</span>
                      {calculation.slabCount > 1 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-brand-100 text-brand-800">
                          {calculation.slabCount} Slabs
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="text-3xl font-bold text-gray-900 tracking-tight">
                        {formatCurrency(calculation.totalInternalCost)}
                      </span>
                      <button
                        onClick={() => handleCopy(calculation.totalInternalCost.toFixed(2), setCopiedCost)}
                        className="ml-auto p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Copy Cost"
                      >
                        {copiedCost ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 w-full" />

                  {/* Quote Price */}
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Quote Price</span>
                    <div className="flex items-center gap-3 bg-brand-50 p-4 rounded-xl border border-brand-100">
                      <span className="text-4xl font-black text-brand-600 tracking-tight">
                        {formatCurrency(calculation.customerPrice)}
                      </span>
                      <button
                        onClick={() => handleCopy(calculation.customerPrice.toFixed(2), setCopiedPrice)}
                        className="ml-auto p-2 text-brand-400 hover:text-brand-700 hover:bg-brand-100 rounded-lg transition-colors"
                        title="Copy Price"
                      >
                        {copiedPrice ? <Check className="h-6 w-6 text-brand-600" /> : <Copy className="h-6 w-6" />}
                      </button>
                    </div>
                  </div>

                  {/* Profit */}
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-400">Estimated Profit</span>
                      <span className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-brand-400" />
                        {formatCurrency(calculation.profit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breakdown Card */}
              <Card title="Cost Breakdown" className="bg-white shadow-md">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Base Slab(s)</span>
                    <span className="font-mono">{formatCurrency(calculation.totalSlabCost)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Adders</span>
                    <span className="font-mono">{formatCurrency(calculation.addersTotal)}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-3" />
                  <div className="flex justify-between font-bold text-gray-900 text-base">
                    <span>Total Cost</span>
                    <span>{formatCurrency(calculation.totalInternalCost)}</span>
                  </div>
                </div>
              </Card>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
