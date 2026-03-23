export interface SonarApiIssue {
  key: string;
  severity?: string;
  message?: string;
  component?: string;
  line?: number;
}

export interface NotificationIssue {
  id: string;
  severity: string;
  message: string;
  component: string;
  line: number | null;
  timestamp: string;
}
