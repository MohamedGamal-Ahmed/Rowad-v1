import { HealthStatus } from '../enums/HealthStatus';

export interface HealthCalculationStrategy {
  calculate(daysRemaining: number, isArchived: boolean): HealthStatus;
}

/**
 * Baseline industry strategy measuring tender priority timeline status.
 */
export class StandardTenderHealthStrategy implements HealthCalculationStrategy {
  public calculate(daysRemaining: number, isArchived: boolean): HealthStatus {
    if (isArchived) {
      return HealthStatus.ARCHIVED;
    }
    if (daysRemaining < 0) {
      return HealthStatus.OVERDUE;
    }
    if (daysRemaining <= 7) {
      return HealthStatus.DUE_SOON;
    }
    return HealthStatus.HEALTHY;
  }
}

export class HealthCalculator {
  private strategy: HealthCalculationStrategy;

  constructor(strategy: HealthCalculationStrategy = new StandardTenderHealthStrategy()) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: HealthCalculationStrategy): void {
    this.strategy = strategy;
  }

  public evaluate(daysRemaining: number, isArchived: boolean = false): HealthStatus {
    return this.strategy.calculate(daysRemaining, isArchived);
  }
}
