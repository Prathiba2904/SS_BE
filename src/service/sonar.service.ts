import axios from "axios";
import { NotificationIssue, SonarApiIssue } from "../types/sonar.types";

const notifications: NotificationIssue[] = [];

export const fetchAndStoreSonarIssues = async (): Promise<{
  addedCount: number;
  totalCount: number;
}> => {
  const sonarUrl = process.env.SONAR_URL || process.env.SONAR_BASE_URL;
  const sonarToken = process.env.SONAR_TOKEN;

  if (!sonarUrl || !sonarToken) {
    throw new Error("SonarQube backend env is missing (SONAR_URL/SONAR_TOKEN).");
  }

  const projectKey = process.env.SONAR_PROJECT_KEY || "spend-smartly";
  const rawSeverities = process.env.SONAR_SEVERITIES || "CRITICAL,HIGH";
  const severityAliasMap: Record<string, string> = {
    HIGH: "MAJOR",
    MEDIUM: "MINOR",
    LOW: "INFO",
  };
  const severities = rawSeverities
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .map((s) => severityAliasMap[s] || s)
    .join(",");

  const response = await axios.get(`${sonarUrl}/api/issues/search`, {
    params: {
      projectKeys: projectKey,
      severities,
    },
    auth: {
      username: sonarToken,
      password: "",
    },
    timeout: 10000,
  });

  const issues: SonarApiIssue[] = response.data?.issues || [];
  let addedCount = 0;

  for (const issue of issues) {
    if (!issue.key) continue;

    const exists = notifications.some((item) => item.id === issue.key);
    if (exists) continue;

    const notification: NotificationIssue = {
      id: issue.key,
      severity: issue.severity || "UNKNOWN",
      message: issue.message || "No message",
      component: issue.component || "Unknown file",
      line: issue.line ?? null,
      timestamp: new Date().toISOString(),
    };

    notifications.push(notification);
    addedCount += 1;

    console.log(
      `New Sonar issue added: [${notification.severity}] ${notification.id} - ${notification.message}`
    );
  }

  return { addedCount, totalCount: notifications.length };
};

export const getNotifications = (): NotificationIssue[] => notifications;
