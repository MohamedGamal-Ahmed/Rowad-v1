import { BilingualString } from '../common/BilingualString';
import { GeneralInformation } from './GeneralInformation';
import { AssignmentInformation } from './AssignmentInformation';
import { TimelineInformation } from './TimelineInformation';
import { FinancialInformation } from './FinancialInformation';
import { StatusInformation } from './StatusInformation';
import { ChecklistInformation } from './ChecklistInformation';
import { DocumentRecord } from './DocumentRecord';
import { NoteRecord } from './NoteRecord';

export interface Tender {
  id: string;
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
