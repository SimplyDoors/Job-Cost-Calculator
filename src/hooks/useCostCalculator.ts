
import { useState, useMemo, useEffect } from 'react';
import { pricingDB, typeLabels, productionAdders, componentAdders, dropShipAdders } from '../data/pricing';

export interface CostState {
  marginPercent: number;
  style: string;
  height: string;
  type: string;
  width: string;
  purchaseType: 'jobLot' | 'pallet' | 'drop';
  selectedProductionAdders: string[]; // Array of names
  selectedComponentAdders: string[]; // Array of names
  selectedDropShipAdders: string[]; // Array of names
}

export const useCostCalculator = () => {
  const [state, setState] = useState<CostState>({
    marginPercent: 30,
    style: 'molded',
    height: '68',
    type: '138HC',
    width: '2/0',
    purchaseType: 'jobLot',
    selectedProductionAdders: [],
    selectedComponentAdders: [],
    selectedDropShipAdders: [],
  });

  // --- Derived Options ---

  const availableTypes = useMemo(() => {
    const types = pricingDB[state.style]?.[state.height];
    if (!types) return [];
    return Object.keys(types).map(key => ({
      value: key,
      label: typeLabels[key] || key
    }));
  }, [state.style, state.height]);

  const availableWidths = useMemo(() => {
    const widths = pricingDB[state.style]?.[state.height]?.[state.type];
    if (!widths) return [];
    return Object.keys(widths).map(key => ({
      value: key,
      label: key
    }));
  }, [state.style, state.height, state.type]);

  // --- Auto-select valid options if current selection becomes invalid ---

  useEffect(() => {
    if (availableTypes.length > 0 && !availableTypes.find(t => t.value === state.type)) {
      setState(s => ({ ...s, type: availableTypes[0].value }));
    }
  }, [availableTypes, state.type]);

  useEffect(() => {
    if (availableWidths.length > 0 && !availableWidths.find(w => w.value === state.width)) {
      setState(s => ({ ...s, width: availableWidths[0].value }));
    }
  }, [availableWidths, state.width]);


  // --- Calculation Logic ---

  const calculation = useMemo(() => {
    let baseCost = 0;
    let isValid = true;
    let slabCount = 1;

    // 1. Base Cost
    const tierIndex = state.purchaseType === 'jobLot' ? 0 : state.purchaseType === 'pallet' ? 1 : 2;
    
    try {
      const rawPrice = pricingDB[state.style]?.[state.height]?.[state.type]?.[state.width]?.[tierIndex];
      if (rawPrice === null || rawPrice === undefined) {
        isValid = false;
      } else {
        baseCost = rawPrice;
      }
    } catch (e) {
      isValid = false;
    }

    // 2. Adders & Slab Count Logic
    let addersTotal = 0;

    // Production Adders
    state.selectedProductionAdders.forEach(name => {
      const adder = productionAdders.find(a => a.name === name);
      if (adder) {
        addersTotal += adder.cost;
        if (name.includes("Double")) {
          slabCount = 2;
        }
      }
    });

    // Component Adders
    state.selectedComponentAdders.forEach(name => {
      const adder = componentAdders.find(a => a.name === name);
      if (adder) {
        addersTotal += adder.cost;
      }
    });

    // Drop Ship Adders
    if (state.purchaseType === 'drop') {
      state.selectedDropShipAdders.forEach(name => {
        const adder = dropShipAdders.find(a => a.name === name);
        if (adder) {
          addersTotal += adder.cost;
        }
      });
    }

    // Adjust Base Cost for Slab Count
    let totalSlabCost = baseCost;
    if (isValid && slabCount === 2) {
      totalSlabCost = baseCost * 2;
    }

    const totalInternalCost = isValid ? totalSlabCost + addersTotal : 0;

    // 3. Margin & Price
    const marginDecimal = state.marginPercent / 100;
    let customerPrice = 0;
    
    if (marginDecimal < 1 && totalInternalCost > 0) {
      customerPrice = totalInternalCost / (1 - marginDecimal);
    }

    const profit = customerPrice - totalInternalCost;
    const markup = totalInternalCost > 0 ? customerPrice / totalInternalCost : 0;

    return {
      isValid,
      baseCost,
      slabCount,
      totalSlabCost,
      addersTotal,
      totalInternalCost,
      customerPrice,
      profit,
      markup
    };
  }, [state]);

  // --- Handlers ---

  const setField = (field: keyof CostState, value: any) => {
    setState(s => ({ ...s, [field]: value }));
  };

  const toggleAdder = (listKey: 'selectedProductionAdders' | 'selectedComponentAdders' | 'selectedDropShipAdders', name: string) => {
    setState(s => {
      const list = s[listKey];
      if (list.includes(name)) {
        return { ...s, [listKey]: list.filter(n => n !== name) };
      } else {
        return { ...s, [listKey]: [...list, name] };
      }
    });
  };

  return {
    state,
    setField,
    toggleAdder,
    availableTypes,
    availableWidths,
    calculation
  };
};
