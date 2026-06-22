import { TimelineRules } from './TimelineRules';

export interface Settings {
  id: string;
  userId: string;
  preferredLanguage: 'en' | 'ar';
  timelineRules: TimelineRules;
}
