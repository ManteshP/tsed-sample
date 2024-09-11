export interface StudentRecentSessionsModel {
    sessionDate: number;
    sessionCorrect: number;
    sessionAttempt: number;
}

export interface SessionUsageThisWeekModel {
    recentSessions: StudentRecentSessionsModel[];
    usageThisWeek: string;
}

export interface StudentSessionUsageThisWeekModel {
    assignmentUserID: string;
    thisWeekSessionUsage: SessionUsageThisWeekModel;
}

export interface StudentSessionUsageThisWeekAPIResponse {
    data: Record<string, SessionUsageThisWeekModel[]>;
}
