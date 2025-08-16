// src/components/financial/shared/hooks/useCurrencyFormat.ts
import { useCallback } from 'react';

interface UseCurrencyFormatOptions {
  currency?: string;
  locale?: string;
  showCurrency?: boolean;
}

export const useCurrencyFormat = (options: UseCurrencyFormatOptions = {}) => {
  const {
    currency = 'EUR',
    locale = 'pt-PT',
    showCurrency = true
  } = options;

  const formatCurrency = useCallback((
    value: number,
    customOptions?: Partial<UseCurrencyFormatOptions>
  ) => {
    const finalOptions = { ...options, ...customOptions };
    
    if (!finalOptions.showCurrency) {
      return new Intl.NumberFormat(finalOptions.locale || locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    }

    return new Intl.NumberFormat(finalOptions.locale || locale, {
      style: 'currency',
      currency: finalOptions.currency || currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }, [currency, locale, showCurrency]);

  const formatPercentage = useCallback((
    value: number,
    decimals: number = 1
  ) => {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100);
  }, [locale]);

  const parseMonetaryInput = useCallback((input: string): number => {
    // Remove everything except numbers, commas and dots
    const cleaned = input.replace(/[^\d.,]/g, '');
    
    // Convert comma to dot (Portuguese standard)
    const normalized = cleaned.replace(',', '.');
    
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const hideValue = useCallback((
    value: string | number,
    showValue: boolean,
    placeholder: string = '••••••'
  ): string => {
    if (showValue) {
      return typeof value === 'number' ? formatCurrency(value) : value.toString();
    }
    return placeholder;
  }, [formatCurrency]);

  return {
    formatCurrency,
    formatPercentage,
    parseMonetaryInput,
    hideValue
  };
};
