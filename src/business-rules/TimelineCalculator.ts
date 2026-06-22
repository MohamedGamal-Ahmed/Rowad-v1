import { TimelineRules } from '../domain/administration/TimelineRules';
import { CalculatedTimeline } from '../domain/pre-award/TimelineInformation';

export class TimelineCalculator {
  private static addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  /**
   * Calculates dynamic milestones based on the main Technical Submission Date and PMO configuration offsets.
   * @param techSubmissionDate baseline submission target
   * @param rules active offsets from administration preferences
   */
  public static calculateMilestones(
    techSubmissionDate: string,
    rules: TimelineRules
  ): CalculatedTimeline {
    if (!techSubmissionDate) {
      return {};
    }

    return {
      kickOffDate: this.addDays(techSubmissionDate, rules.kickOffOffset),
      riskDueDate: this.addDays(techSubmissionDate, rules.riskAssessmentOffset),
      contractQualsDueDate: this.addDays(techSubmissionDate, rules.contractQualificationOffset),
      alignmentDate: this.addDays(techSubmissionDate, rules.alignmentOffset),
      followUpDate: this.addDays(techSubmissionDate, rules.intermediateFollowUpOffset)
    };
  }
}
