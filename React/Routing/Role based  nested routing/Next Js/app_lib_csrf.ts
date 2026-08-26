import { Csrf } from "csrf"
import { getCsrfSecret } from "./secrets"

const csrf = new Csrf()

export function generateCsrfToken(): string {
  return csrf.create(getCsrfSecret())
}

export function validateCsrfToken(token: string): boolean {
  return csrf.verify(getCsrfSecret(), token)
}

