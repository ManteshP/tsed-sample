import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import { PlatformContext } from "@tsed/common";
import { InjectContext } from "@tsed/di";

export class BearerRestDataSource extends RESTDataSource {
    @InjectContext()
    protected $ctx: PlatformContext;

    constructor(private readonly timeout: number) {
        super();
    }

    protected willSendRequest(path: string, request: AugmentedRequest): void {
        const { authorization } = this.$ctx.headers.authorization;
        request.headers['Authorization'], authorization;
        request.headers['Content-Type'], 'application/json';
    }
}
