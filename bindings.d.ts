import { SessionStorage } from "remix";
import { AppData } from "@remix-run/server-runtime";
import { Params } from "react-router";

interface Env extends SessionStorage {
  DEV_BLOG: KVNamespace;
  CFP_CLIENT_SECRET: string;
  CFP_TOKEN_SECRET: string;
  CFP_ACCOUT_ID: string;
}

interface Context {
  env: Env;
}

declare global {
  export interface DataFunctionArgs {
    request: Request;
    context: Context;
    params: Params;
  }

  export interface ActionFunction {
    (args: DataFunctionArgs):
      | Promise<Response>
      | Response
      | Promise<AppData>
      | AppData;
  }

  export interface ActionFunction {
    (args: DataFunctionArgs):
      | Promise<Response>
      | Response
      | Promise<AppData>
      | AppData;
  }
  export interface LoaderFunction {
    (args: DataFunctionArgs):
      | Promise<Response>
      | Response
      | Promise<AppData>
      | AppData;
  }
}
