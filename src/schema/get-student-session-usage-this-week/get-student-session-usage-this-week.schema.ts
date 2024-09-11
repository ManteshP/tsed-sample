import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class StudentSessionDetails {
    @Field({ nullable: false })
    public sessionDate: string;

    @Field({ nullable: false })
    public sessionCorrect: string;

    @Field({ nullable: false })
    public sessionAttempt: string;
}

@ObjectType()
export class SessionUsageThisWeek {
    @Field((type) => [StudentSessionDetails])
    public sessions: StudentSessionDetails[];

    @Field({ nullable: false })
    public usage: string;
}

@ObjectType()
export class StudentSessionUsageThisWeek {
    @Field({ nullable: false })
    public assignmentUserID: string;

    @Field({ nullable: false })
    public thisWeekSessionUsage: SessionUsageThisWeek;
}


