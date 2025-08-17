// src/components/financial/shared/hooks/useCurrencyFormat.ts
import { useCallback } from 'react';
import { 
  formatCurrency as formatCurrencyUtil,
  formatPercentage as formatPercentageUtil,
  parseMonetaryInput as parseMonetaryInputUtil,
  hideValue as hideValueUtil
} from '../../../../utils/financial/formatters';

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

    return formatCurrencyUtil(value, finalOptions.currency || currency, finalOptions.locale || locale);
  }, [currency, locale, showCurrency]);

  const formatPercentage = useCallback((
    value: number,
    decimals: number = 1
  ) => {
    return formatPercentageUtil(value, decimals, locale);
  }, [locale]);

  const parseMonetaryInput = useCallback((input: string): number => {
    return parseMonetaryInputUtil(input);
  }, []);

  const hideValue = useCallback((
    value: string | number,
    showValue: boolean,
    placeholder: string = '••••••'
  ): string => {
    return hideValueUtil(value, showValue, placeholder);
  }, []);

  return {
    formatCurrency,
    formatPercentage,
    parseMonetaryInput,
    hideValue
  };
};
