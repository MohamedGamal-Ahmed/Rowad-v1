import { BaseEntity } from '../common/BaseEntity';
import { BilingualString } from '../common/BilingualString';
import { Money } from '../common/Money';

export type ProjectControlsRecordType = 'IPC' | 'Claim' | 'Variation Order' | 'NOC';

export interface ProjectControlsRecord extends BaseEntity {
  type: ProjectControlsRecordType;
  code: string;
  projectName: BilingualString;
  submittedDate: string; // ISO String (YYYY-MM-DD)
  valueAED: Money;       // Custom Money Value Object
  status: BilingualString;
  health: 'Healthy' | 'Urgent' | 'Under Review';
  department: BilingualString;
  contractor: string;
  progress: number;      // 0 to 100
}
