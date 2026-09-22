import { defineConfig, globalIgnores } from 'eslint/config'
import nextConfig from 'eslint-config-next'

export default defineConfig([
    ...nextConfig,
    {
        // eslint-config-next 16 turned these React Compiler rules on as errors.
        // The code they flag predates them and the project does not run the
        // compiler, so they stay visible as warnings until that code is
        // revisited rather than failing lint outright.
        rules: {
            'react-hooks/set-state-in-effect': 'warn',
            'react-hooks/refs': 'warn',
            'react-hooks/immutability': 'warn',
        },
    },
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
])
