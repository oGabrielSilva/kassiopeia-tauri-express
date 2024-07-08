import { Exception } from '@app/models/Exception'
import { useAuth } from '@app/stores/useAuth'
import app from '@resources/config/app.json'
import { ValidationKassiopeiaTool } from 'kassiopeia-tools'

interface IAPIOptions {
  body?: { [key: string]: unknown }
  headers?: Headers
  credentials?: RequestCredentials
}

export interface IJsonAPIResult<T = null> {
  body: T | null
  response: Response
  error: Exception | null
}

type TRequestMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE'

const validation = new ValidationKassiopeiaTool()

export class FormDataAPI {
  private static instance: FormDataAPI
  private static baseURL = app.api

  public static resolvePath(input: string) {
    if (input.startsWith('https://') || input.startsWith('www'))
      return validation.normalizeURI(input)

    return validation.normalizeURI(
      (FormDataAPI.baseURL.endsWith('/')
        ? FormDataAPI.baseURL
        : FormDataAPI.baseURL + '/'
      ).concat(input.startsWith('/') ? input.slice(1) : input),
    )
  }

  private requireHeaders(options?: IAPIOptions) {
    const headers = new Headers()
    if (options && options.headers) {
      options.headers.forEach((headerValue, headerKey) =>
        headers.set(headerKey, headerValue),
      )
    }

    const auth = useAuth()

    if (auth && auth.token) headers.set('Authorization', `Bearer ${auth.token}`)

    return headers
  }

  private async makeRequest<T = null>(
    input: string,
    method: TRequestMethod,
    options?: IAPIOptions,
  ) {
    const init: RequestInit = {}
    init.method = method

    if (options) {
      if (options.body && typeof options.body !== 'string') {
        const data = new FormData()
        for (const key in options.body) {
          if (Array.isArray(options.body[key])) {
            options.body[key].forEach((value) => {
              data.append(key + '[]', value)
            })
          } else data.set(key, options.body[key] as string)
        }

        init.body = data
      }

      if (options.credentials) init.credentials = options.credentials
    }

    const headers = this.requireHeaders(options)
    init.headers = headers

    const response = await fetch(FormDataAPI.resolvePath(input), init)
    const result: IJsonAPIResult<T> = { body: null, error: null, response }

    try {
      const json = await response.json()
      if (response.ok) result.body = json
      else result.error = Exception.from(json)
    } catch (error) {
      console.log(error)
    }

    return result
  }

  public async POST<T = null>(input: string, options?: IAPIOptions) {
    return await this.makeRequest<T>(input, 'POST', options)
  }

  public async PATCH<T = null>(input: string, options?: IAPIOptions) {
    return await this.makeRequest<T>(input, 'PATCH', options)
  }

  public async PUT<T = null>(input: string, options?: IAPIOptions) {
    return await this.makeRequest<T>(input, 'PUT', options)
  }

  public async DELETE<T = null>(input: string, options?: IAPIOptions) {
    return await this.makeRequest<T>(input, 'DELETE', options)
  }

  public static get request() {
    if (!FormDataAPI.instance) {
      FormDataAPI.instance = new FormDataAPI()
    }
    return FormDataAPI.instance
  }
}
