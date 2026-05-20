export const ACTIVE_TAB = {
  FILE: 'file',
  CODE: 'code',
  URL: 'url',
} as const;

export type ActiveTabType = typeof ACTIVE_TAB[keyof typeof ACTIVE_TAB];
