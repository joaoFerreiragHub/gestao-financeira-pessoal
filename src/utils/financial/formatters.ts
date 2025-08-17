// src/utils/financial/formatters.ts
// ✅ CONSOLIDAÇÃO CENTRAL DE FORMATAÇÃO DE MOEDA E NÚMEROS

/**
 * Formatação de moeda padronizada para toda a aplicação
 */
export const formatCurrency = (
  value: number, 
  currency = 'EUR', 
  locale = 'pt-PT'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(value));
};

/**
 * Formatação de percentagem
 */
export const formatPercentage = (
  value: number,
  decimals = 1,
  locale = 'pt-PT'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Formatação de números com separadores
 */
export const formatNumber = (
  value: number,
  decimals = 2,
  locale = 'pt-PT'
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Converter input monetário para número
 */
export const parseMonetaryInput = (input: string): number => {
  // Remove tudo exceto números, vírgulas e pontos
  const cleaned = input.replace(/[^\d.,]/g, '');
  
  // Converte vírgula para ponto (padrão português)
  const normalized = cleaned.replace(',', '.');
  
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Ocultar valor com placeholder
 */
export const hideValue = (
  value: string | number,
  showValue: boolean,
  placeholder = '••••••'
): string => {
  if (showValue) {
    return typeof value === 'number' ? formatCurrency(value) : value.toString();
  }
  return placeholder;
};

/**
 * Formatar valor com sinal (+ ou -)
 */
export const formatCurrencyWithSign = (
  value: number,
  currency = 'EUR',
  locale = 'pt-PT'
): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatCurrency(value, currency, locale)}`;
};

/**
 * Formatar valor compacto (1K, 1M, etc.)
 */
export const formatCompactCurrency = (
  value: number,
  currency = 'EUR',
  locale = 'pt-PT'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(Math.abs(value));
};
