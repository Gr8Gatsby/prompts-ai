export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',    // New feature
        'fix',     // Bug fix
        'docs',    // Documentation changes
        'style',   // Code style changes (formatting, missing semi colons, etc)
        'refactor',// Code changes that neither fixes a bug nor adds a feature
        'perf',    // Performance improvements
        'test',    // Adding or updating tests
        'build',   // Changes that affect the build system or external dependencies
        'ci',      // Changes to CI configuration files and scripts
        'chore',   // Other changes that don't modify src or test files
        'revert',  // Reverts a previous commit
      ],
    ],
    'type-case': [2, 'always', 'lower'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'always', 'sentence-case'],
  },
}; 