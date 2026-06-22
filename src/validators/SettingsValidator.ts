import { Settings } from '../domain/administration/Settings';
import { ValidationResult } from './TenderValidator';

export class SettingsValidator {
  /**
   * Enforces that all PMO calculated milestones reside chronologically BEFORE the submission dates.
   * All offsets must be negative or zero.
   */
  public static validate(settings: Settings): ValidationResult {
    const errors: string[] = [];
    const rules = settings.timelineRules;

    if (rules.kickOffOffset > 0) {
      errors.push('Kick-off alignment offset must be negative or zero (days prior to submission).');
    }
    if (rules.riskAssessmentOffset > 0) {
      errors.push('Risk assessment review offset must be negative or zero (days prior to submission).');
    }
    if (rules.contractQualificationOffset > 0) {
      errors.push('Contractual qualifications offset must be negative or zero (days prior to submission).');
    }
    if (rules.alignmentOffset > 0) {
      errors.push('Alignment and consensus offset must be negative or zero (days prior to submission).');
    }
    if (rules.intermediateFollowUpOffset > 0) {
      errors.push('Intermediate follow-up offset must be negative or zero (days prior to submission).');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
