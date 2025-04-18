import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { readFileSync } from 'fs'

// Parse .gitignore to get ignore patterns
const gitignorePatterns = readFileSync('.gitignore', 'utf-8')
  .split(/\r?\n/)
  .filter(line => line.trim() && !line.startsWith('#'))

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**', 
      '**/dist-ssr/**', 
      '**/coverage/**', 
      'src/components/ui/', 
      "telegram-bot/", 
      "tailwind.config.js",
      ...gitignorePatterns
    ],
  },

  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
  // Add your own rules here ( @typescript-eslint/no-explicit-any)
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
