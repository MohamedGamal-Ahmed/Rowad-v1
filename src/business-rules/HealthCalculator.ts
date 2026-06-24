import { HealthStatus } from '../enums/HealthStatus';
import { HealthSettings } from '../domain/administration/Settings';

export interface HealthCalculationStrategy {
  calculate(daysRemaining: number, isArchived: boolean, settings?: HealthSettings): HealthStatus;
}

/**
 * Baseline industry strategy measuring tender priority timeline status.
 */
export class StandardTenderHealthStrategy implements HealthCalculationStrategy {
  public calculate(daysRemaining: number, isArchived: boolean, settings?: HealthSettings): HealthStatus {
    if (isArchived) {
      return HealthStatus.ARCHIVED;
    }
    
    const overdueThreshold = settings ? settings.overdueThresholdDays : 0;
    const dueSoonThreshold = settings ? settings.dueSoonThresholdDays : 7;

    if (daysRemaining < overdueThreshold) {
      return HealthStatus.OVERDUE;
    }
    if (daysRemaining <= dueSoonThreshold) {
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

  public evaluate(daysRemaining: number, isArchived: boolean = false, settings?: HealthSettings): HealthStatus {
    return this.strategy.calculate(daysRemaining, isArchived, settings);
  }

  /**
   * Static access method to evaluate health dynamically.
   */
  public static calculate(daysRemaining: number, isArchived: boolean = false, settings?: HealthSettings): HealthStatus {
    const calc = new HealthCalculator();
    return calc.evaluate(daysRemaining, isArchived, settings);
  }
}
