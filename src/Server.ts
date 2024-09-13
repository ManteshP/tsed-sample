import { Configuration, Inject, PlatformApplication } from "@tsed/common";
import bodyParser from "body-parser";
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import { GraphQLFormattedError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import methodOverride from 'method-override';

import { customAuthChecker } from "./auth-checker/custom-auth.checker";
import { config } from "./config";
import * as rest from "./controllers/rest/index";
import { StudentSessionUsageThisWeekResolver } from "./schema/get-student-session-usage-this-week/get-student-session-usage-this-week.resolver";

import '../src/model/common/context'
// /!\ keep this import
import "@tsed/ajv";
import "@tsed/graphql-ws";
import "@tsed/platform-express";
import "@tsed/typegraphql";

const isStackTraceEnabled = process.env.STACK_TRACE_ENABLED === 'true';
const setHttpPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse(Response: any): Promise<void> {
        const { response } = Response;
        const ErrorResponse = response?.errors?.[0]?.extensions;
        if (ErrorResponse) {
          response.http.status = ErrorResponse?.response?.status || ErrorResponse?.status;
        }
      }
    };
  }
};

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  disableComponentsScan: true,
  ajv: {
    returnsCoercedValues: true
  },
  mount: {
    "/rest": [
      ...Object.values(rest)
    ]
  },
  apollo: {
    server1: {
      path: '/graphql',
      includeStacktraceInErrorResponses: true,
      debug: isStackTraceEnabled,
      playground: true,
      resolvers: [
        StudentSessionUsageThisWeekResolver
      ],
      buildSchemaOptions: {
        authChecker: customAuthChecker,
        emitSchemaFile: true
      },
      plugins: [setHttpPlugin],
      formatError: (formattedError: GraphQLFormattedError, error: unknown) => {
        let extensions: any = {};
        if (formattedError.extensions && formattedError.extensions.code) {
          let statusCode;
          switch (formattedError.extensions.code) {
            case 'INTERNAL_SERVER_ERROR':
              statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
              break;
            case 'GRAPHQL_VALIDATION_FAILED':
              statusCode = StatusCodes.BAD_REQUEST;
              break;
            case 'FORBIDDEN':
              statusCode = StatusCodes.FORBIDDEN;
              break;
            default:
              if (Number(formattedError.extensions.code) || formattedError.extensions.status) {
                statusCode = formattedError.extensions?.status || formattedError.extensions?.code;
              } else {
                // Default to a sensible status code
                statusCode = StatusCodes.BAD_REQUEST;
                // Add a flag to indicate a malformed error
                extensions.malformedError = true;
              }
          }
          extensions = { ...extensions, code: formattedError.extensions.code, status: statusCode };
        }
        if (formattedError.extensions && formattedError.extensions.status) {
          extensions = { ...extensions, status: formattedError.extensions.status };
        }
        if (formattedError.extensions && formattedError.extensions.response) {
          extensions = { ...extensions, response: formattedError.extensions.response };
        }
        if (formattedError.extensions && formattedError.extensions.exception) {
          let processedException = {};
          if (formattedError.extensions.stacktrace) {
            processedException = { stacktrace: formattedError.extensions.stacktrace };
          }
          extensions = { ...extensions, exception: processedException };
        }
        /**
         * TODO: We might want to go in the path of doing error masking for some error messages,  
         * to prevent leaking some internal information.
         * https://learning.postman.com/open-technologies/blog/graphql-error-handling/
         */
        return { message: formattedError.message, path: formattedError.path, extensions };
      }
    }
  }
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;

  public $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(
        session({
          secret: "mysecretkey",
          resave: true,
          saveUninitialized: true,
          // maxAge: 36000,
          cookie: {
            path: "/",
            httpOnly: true,
            secure: false
          }
        })
      );
  }
}
