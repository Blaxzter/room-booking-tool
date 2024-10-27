import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    ignores: [
      "dist/",
      "src/components/ui/",
      "telegram-bot/",
      "tailwind.config.js"
    ]
  },
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
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
