import { APIGatewayEvent, Handler } from "aws-lambda"
import { Resolver } from "dns"
import "regenerator-runtime/runtime"

export interface Headers {
  [key: string]: string
}

export type ReverseRequest = {
  servers?: string[]
  ip?: string
}

export type ReverseResponse = {
  statusCode: number
  headers?: Headers
  body: string
}

class StatusCodeError extends Error {
  statusCode: number
  headers?: Headers

  constructor(message: string, statusCode: number, headers?: Headers) {
    super(message)
    this.statusCode = statusCode
    this.headers = headers
  }
}

export type ReverseResult = string[]

async function reverseAsync(request: ReverseRequest): Promise<ReverseResult> {
  return new Promise((resolve, reject) => {
    if (!request.servers) {
      return reject(new StatusCodeError("Missing servers.", 400))
    }

    if (!request.ip) {
      return reject(new StatusCodeError("Missing IP.", 400))
    }

    const resolver = new Resolver()

    resolver.setServers(request.servers)

    resolver.reverse(request.ip, (err, hostnames) => {
      if (err) {
        return reject(err)
      }

      resolve(hostnames)
    })
  })
}

const handler: Handler<APIGatewayEvent, ReverseResponse> = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      throw new StatusCodeError(
        `HTTP method ${event.httpMethod} not allowed. Must be POST.`,
        405,
        { Allow: "POST" }
      )
    }

    if (!event.body) {
      throw new StatusCodeError("Missing request body.", 400)
    }

    const request: ReverseRequest = JSON.parse(event.body)
    const result = await reverseAsync(request)

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: err.headers || {},
      body: JSON.stringify({
        error: err.message,
      }),
    }
  }
}

export { handler }
