import { BaseEntity } from '../common/BaseEntity';
import { BilingualString } from '../common/BilingualString';
import { DocumentRecord } from '../common/DocumentRecord';
import { NoteRecord } from '../common/NoteRecord';
import { GeneralInformation } from './GeneralInformation';
import { AssignmentInformation } from './AssignmentInformation';
import { TimelineInformation } from './TimelineInformation';
import { FinancialInformation } from './FinancialInformation';
import { StatusInformation } from './StatusInformation';
import { ChecklistInformation } from './ChecklistInformation';

export interface Tender extends BaseEntity {
  projectCode: string;
  tenderNumber: string;
  projectName: BilingualString;
  general: GeneralInformation;
  assignments: AssignmentInformation;
  timeline: TimelineInformation;
  financials: FinancialInformation;
  status: StatusInformation;
  checklist: ChecklistInformation;
  documents: DocumentRecord[];
  notes: NoteRecord[];
}
