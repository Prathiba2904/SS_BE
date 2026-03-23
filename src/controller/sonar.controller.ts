import { Request, Response } from "express";
import { fetchAndStoreSonarIssues, getNotifications } from "../service/sonar.service";

export const fetchSonarIssues = async (_req: Request, res: Response) => {
  try {
    const result = await fetchAndStoreSonarIssues();
    return res.status(200).json({
      message: "SonarQube issues fetched successfully",
      ...result,
    });
  } catch (error: any) {
    const status = error?.response?.status;
    const sonarMessage = error?.response?.data;
    console.error(
      "Failed to fetch SonarQube issues:",
      status || error?.message || error,
      sonarMessage || ""
    );
    return res.status(500).json({
      message: "Failed to fetch SonarQube issues. SonarQube may be unreachable.",
    });
  }
};

export const listNotifications = (_req: Request, res: Response) => {
  return res.status(200).json({
    notifications: getNotifications(),
  });
};
