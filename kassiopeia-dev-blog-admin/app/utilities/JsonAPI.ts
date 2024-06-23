import { Exception } from '@app/models/Exception'
import { useAuth } from '@app/stores/useAuth'
import app from '@resources/config/app.json'
import { ValidationKassiopeiaTool } from 'kassiopeia-tools'

interface IJsonAPIOptions {
  body?: unknown
  headers?: Headers
  credentials?: RequestCredentials
}

interface IJsonAPIResult<T = null> {
  body: T | null
  response: Response
  error: Exception | null
}

type TRequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

const validation = new ValidationKassiopeiaTool()

export class JsonAPI {
  private static baseURL = app.api

  public static resolvePath(input: string) {
    if (input.startsWith('https://') || input.startsWith('www'))
      return validation.normalizeURI(input)

    return validation.normalizeURI(
      (JsonAPI.baseURL.endsWith('/')
        ? JsonAPI.baseURL
        : JsonAPI.baseURL + '/'
      ).concat(input.startsWith('/') ? input.slice(1) : input),
    )
  }

  private requireHeaders(options?: IJsonAPIOptions) {
    const headers = new Headers()
    if (options && options.headers) {
      options.headers.forEach((headerValue, headerKey) =>
        headers.set(headerKey, headerValue),
      )
    }
    headers.set('Content-Type', 'application/json')

    const auth = useAuth()

    if (auth && auth.token) headers.set('Authorization', `Bearer ${auth.token}`)

    return headers
  }

  private async makeRequest<T = null>(
    input: string,
    method: TRequestMethod,
    options?: IJsonAPIOptions,
  ) {
    const init: RequestInit = {}
    init.method = method

    if (options) {
      if (options.body && typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body)
        init.body = options.body as string
      }

      if (options.credentials) init.credentials = options.credentials
    }

    const headers = this.requireHeaders(options)
    init.headers = headers

    const response = await fetch(JsonAPI.resolvePath(input), init)
    const result: IJsonAPIResult<T> = { body: null, error: null, response }

    try {
      const json = await response.json()
      if (response.ok) result.body = json
      else result.error = Exception.from(json)
    } catch (error) {}

    return result
  }

  public async GET<T = null>(input: string, options?: IJsonAPIOptions) {
    return await this.makeRequest<T>(input, 'GET', options)
  }

  public async POST<T = null>(input: string, options?: IJsonAPIOptions) {
    return await this.makeRequest<T>(input, 'POST', options)
  }

  public async PATCH<T = null>(input: string, options?: IJsonAPIOptions) {
    return await this.makeRequest<T>(input, 'PATCH', options)
  }

  public async PUT<T = null>(input: string, options?: IJsonAPIOptions) {
    return await this.makeRequest<T>(input, 'PUT', options)
  }

  public async DELETE<T = null>(input: string, options?: IJsonAPIOptions) {
    return await this.makeRequest<T>(input, 'DELETE', options)
  }

  public static get request() {
    return new JsonAPI()
  }
}
