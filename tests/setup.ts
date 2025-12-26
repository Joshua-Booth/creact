import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup())
EOF && git add -f tests/setup.ts && git commit -m "chore: create tests/setup.ts"