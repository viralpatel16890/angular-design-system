import type { Preview } from '@storybook/angular';

// Global styles are already loaded through the `showcase` Angular build
// target's `styles` option (see angular.json), which the
// `@storybook/angular` webpack builder picks up via its `browserTarget`.
// A duplicate side-effect `import` here isn't run through the same
// style-loader pipeline and fails TypeScript's module resolution.

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals['theme'] ?? 'light';
      document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
      return story();
    },
  ],
};

export default preview;
