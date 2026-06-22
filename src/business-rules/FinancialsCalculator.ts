import { Money } from '../domain/common/Money';
import { Currency } from '../enums/Currency';

export class FinancialsCalculator {
  /**
   * Safely parses formatted raw values or currencies into a clean float value.
   * E.g., "AED 50,200.50" -> 50200.50
   */
  public static parseToNumber(formattedStr: string | undefined): number {
    if (!formattedStr) return 0;
    const clean = formattedStr.replace(/[^\d.]/g, '');
    return parseFloat(clean) || 0;
  }

  /**
   * Translates amount with thousands delimiters and decimal padding.
   */
  public static formatAmount(amount: number): string {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  /**
   * Aggregates multiple Money objects into a single currency representation.
   * (In real-world environments with FastAPI backend connection, currency exchange rates are queried)
   */
  public static sumAmounts(moneyItems: Money[], targetCurrency: Currency = Currency.AED): Money {
    // Standard static conversions matching pre-defined mock currency weights for consistency
    const conversionToAED: Record<Currency, number> = {
      [Currency.AED]: 1.0,
      [Currency.SAR]: 0.98,
      [Currency.EGP]: 0.076,
      [Currency.USD]: 3.67
    };

    let totalAED = 0;
    for (const item of moneyItems) {
      const rate = conversionToAED[item.currency] || 1.0;
      totalAED += item.amount * rate;
    }

    const targetRate = conversionToAED[targetCurrency] || 1.0;
    const finalAmount = totalAED / targetRate;

    return {
      amount: Math.round(finalAmount * 100) / 100, // Round to 2 decimal places
      currency: targetCurrency
    };
  }
}
