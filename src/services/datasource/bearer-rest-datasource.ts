import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import { InjectApolloContext } from "@tsed/apollo";
import { PlatformContext } from "@tsed/common";
import { InjectContext } from "@tsed/di";
import { CustomApolloContext } from "src/model/common/context";

export class BearerRestDataSource extends RESTDataSource {
    @InjectContext()
    protected $ctx: PlatformContext;

    @InjectApolloContext()
    protected context: CustomApolloContext;
    
    constructor(private readonly timeout: number) {
        super();
    }

    protected willSendRequest(path: string, request: AugmentedRequest): void {
        const { authorization } = this.$ctx.headers.authorization;
        request.headers['Authorization'], authorization;
        request.headers['Content-Type'], 'application/json';
    }
}
