import { assertEquals } from 'std/testing/asserts.ts'
import { errorMapper } from './errorMapper.ts'
import { ZodError } from 'x/zod@v3.20.2/mod.ts'
import { HttpError } from "std/http/http_errors.ts"

Deno.test('errorMapper maps ZodError to expected error response', () => {
  const zodError = new ZodError([
    {
      code: 'invalid_type',
      message: 'invalid type',
      path: ['username'],
      expected: 'string',
      received: 'number',
    },
  ])

  const expectedErrorResponse = {
    status: 422,
    body: {
      message: 'Validation Error',
      details: [
        {
          fieldPath: ['username'],
          message: 'invalid type',
          code: 'invalid_type',
        },
      ],
    },
  }

  assertEquals(errorMapper(zodError, false), expectedErrorResponse)
})

Deno.test('errorMapper maps HttpError to expected error response', () => {
  const httpError = new HttpError()

  const expectedErrorResponse = {
    status: 500,
    body: {
      message: 'Http Error',
    },
  }

  assertEquals(errorMapper(httpError, false), expectedErrorResponse)
})

Deno.test('errorMapper maps generic Error to expected error response', () => {
  const error = new Error('Some error')

  const expectedErrorResponse = {
    status: 500,
    body: {
      message: 'Internal Server Error',
      details: 'Some error',
    },
  }

  assertEquals(errorMapper(error, false), expectedErrorResponse)
})
