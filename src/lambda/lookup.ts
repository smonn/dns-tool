import { Handler, Context, Callback, APIGatewayEvent } from "aws-lambda"
import { Resolver } from 'dns';

export type RRType = 'A' | 'AAAA' | 'ANY' | 'CNAME' | 'MX' | 'NAPTR' | 'NS' | 'PTR' | 'SOA' | 'SRV' | 'TXT';

export type LookupRequest = {
  servers: string[];
  hostname: string;
  type: RRType;
}

/*
'A'	IPv4 addresses (default)	<string>	dns.resolve4()
'AAAA'	IPv6 addresses	<string>	dns.resolve6()
'ANY'	any records	<Object>	dns.resolveAny()
'CNAME'	canonical name records	<string>	dns.resolveCname()
'MX'	mail exchange records	<Object>	dns.resolveMx()
'NAPTR'	name authority pointer records	<Object>	dns.resolveNaptr()
'NS'	name server records	<string>	dns.resolveNs()
'PTR'	pointer records	<string>	dns.resolvePtr()
'SOA'	start of authority records	<Object>	dns.resolveSoa()
'SRV'	service records	<Object>	dns.resolveSrv()
'TXT'	text records	<string[]>	dns.resolveTxt()
*/


const handler: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  try {
    if (event.httpMethod !== 'POST') {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({ error: 'Must be a POST' }),
      });
      return;
    }
  
    if (!event.body) {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({ error: 'No request body.' }),
      });
      return;
    }
  
    const request: LookupRequest = JSON.parse(event.body);
    const resolver = new Resolver();
    resolver.setServers(request.servers);
    resolver.resolve(request.hostname, request.type, (err, addresses) => {
      if (err) {
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({ error: err.message }),
        });
        return;
      }
  
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(addresses),
      });
    });
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    });
  }
};

export { handler }
