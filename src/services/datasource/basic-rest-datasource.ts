import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";

export class BasicRestDataSource extends RESTDataSource {

  constructor(private readonly user: string, private readonly pass: string, private readonly timeout: number) {
    super();
  }

  protected async willSendRequest(path: string, request: AugmentedRequest): Promise<void> {
    const creds = `${this.user}:${this.pass}`;
    const token = Buffer.from(creds).toString('base64');
    request.headers["authorization"] = `Basic ${token}`;
  }
}
