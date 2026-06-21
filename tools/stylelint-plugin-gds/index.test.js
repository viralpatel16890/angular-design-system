'use strict';

const stylelint = require('stylelint');
const plugin = require('./index.js');

const { ruleName } = plugin;

async function lint(code, config) {
  return stylelint.lint({
    code,
    config: {
      plugins: [require.resolve('./index.js')],
      rules: {
        [ruleName]: config ?? true,
      },
    },
  });
}

describe('gds/no-primitive-token-in-component', () => {
  it('warns when a component references --color-violet-500', async () => {
    const result = await lint('.gds-btn { color: var(--color-violet-500); }');
    expect(result.results[0].warnings.length).toBeGreaterThan(0);
    expect(result.results[0].warnings[0].rule).toBe(ruleName);
  });

  it('passes when referencing a semantic token', async () => {
    const result = await lint('.gds-btn { color: var(--color-brand-primary); }');
    expect(result.results[0].warnings.length).toBe(0);
  });

  it('warns on neutral primitive tokens', async () => {
    const result = await lint('.gds-input { border-color: var(--color-neutral-300); }');
    expect(result.results[0].warnings.length).toBeGreaterThan(0);
  });

  it('passes when rule is disabled', async () => {
    const result = await lint('.gds-btn { color: var(--color-violet-500); }', null);
    expect(result.results[0].warnings.length).toBe(0);
  });

  it('warns on component token definitions that reference primitives', async () => {
    const result = await lint(':host { --btn-bg: var(--color-violet-600); }');
    expect(result.results[0].warnings.length).toBeGreaterThan(0);
  });
});
