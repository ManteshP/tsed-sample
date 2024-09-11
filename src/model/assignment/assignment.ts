export interface UserAssignmentData {
    userAssignmentId: string;
    createDate?: number;
    score?: number;
    correctAnswers: number;
    totalQuestions?: number;
    completionStatus: string;
    totalTime?: number;
    successStatus: string;
    scoreSource?: string;
    scoreSent: boolean;
    manualScore?: boolean;
    needsManualScoring?: boolean;
}

export interface UserAssignmentLanguage {
    userAssignmentId: string;
    itemUuid: string;
    itemVersion: number;
    isSelected: boolean;
    languageLocale: string;
    isdefault: boolean;
}

export interface UserAssignment {
    assignmentId: string;
    itemType: string;
    classUuid: string;
    studentUuid: string;
    id: string;
    lastOpenDate: number;
    attachmentUrl: string;
    markCompleted: boolean;
    autoCompleteEnabled: boolean;
    autoCompleted: boolean;
    createdDate: number;
    userAssignmentStatus: string;
    attachmentTitle: string;
    userAssignmentDataList: UserAssignmentData[];
    userAssignmentLanguageList: UserAssignmentLanguage[];
    studentGoogleDocAssignmentId: string;
    deleted: boolean;
    correctTasks: number;
    totalTasks: number;
}

export interface StudentAssignment {
    courseName: string;
    courseType: number;
    creatorId: string;
    dateCreated: number;
    assignmentUserId: number;
    subjectId: number;
    assignmentId: number;
    productId: number;
    sessionLengthMin: number;
    contentBaseId: number;
    asmtCompleteStatus: number;
    assignmentEndTime?: number;
    asmtActiveStatus: number;
}

export interface StudentDashboardCourseLicense {
    studentCourse: StudentAssignment[]
}

