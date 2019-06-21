import 'regenerator-runtime/runtime';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { Resolver, MxRecord, NaptrRecord, SoaRecord, SrvRecord, AnyRecord } from 'dns';

export type RRType = 'A' | 'AAAA' | 'ANY' | 'CNAME' | 'MX' | 'NAPTR' | 'NS' | 'PTR' | 'SOA' | 'SRV' | 'TXT';

export interface Headers {
  [key: string]: string;
}

export type LookupRequest = {
  servers?: string[];
  hostname?: string;
  type?: RRType;
}

export type LookupResponse = {
  statusCode: number;
  headers?: Headers;
  body: string;
}

class StatusCodeError extends Error {
  statusCode: number;
  headers?: Headers;

  constructor(message: string, statusCode: number, headers?: Headers) {
    super(message);
    this.statusCode = statusCode;
    this.headers = headers;
  }
}

export type ResolveResult = string[] | MxRecord[] | NaptrRecord[] | SoaRecord | SrvRecord[] | string[][] | AnyRecord[];

async function resolveAsync(request: LookupRequest): Promise<ResolveResult> {
  return new Promise((resolve, reject) => {
    if (!request.servers) {
      return reject(new StatusCodeError('Missing servers.', 400));
    }

    if (!request.hostname) {
      return reject(new StatusCodeError('Missing hostname.', 400));
    }

    if (!request.type) {
      return reject(new StatusCodeError('Missing record type.', 400));
    }

    const resolver = new Resolver();

    resolver.setServers(request.servers);

    resolver.resolve(request.hostname, request.type, (err, addresses) => {
      if (err) {
        return reject(err);
      }

      resolve(addresses);
    });
  });
}

const handler: Handler<APIGatewayEvent, LookupResponse> = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      throw new StatusCodeError(`HTTP method ${event.httpMethod} not allowed. Must be POST.`, 405, { Allow: 'POST' });
    }
  
    if (!event.body) {
      throw new StatusCodeError('Missing request body.', 400);
    }

    const request: LookupRequest = JSON.parse(event.body);
    const result = await resolveAsync(request);

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: err.headers || {},
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};

export { handler };

