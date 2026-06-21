'use strict';

const stylelint = require('stylelint');

const ruleName = 'gds/no-primitive-token-in-component';

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (token) =>
    `Do not use primitive token "${token}" in component SCSS. Reference a semantic or component token instead (Tier 2 or 3).`,
});

const meta = {
  url: 'https://github.com/your-org/angular-design-system/tree/main/tools/stylelint-plugin-gds',
  fixable: false,
};

// Primitive token prefixes that must NOT appear in component SCSS
const PRIMITIVE_PATTERNS = [
  /--color-violet-\d+/,
  /--color-neutral-\d+/,
  /--color-teal-\d+/,
  /--color-red-\d+/,
  /--color-amber-\d+/,
  /--color-green-\d+/,
  /--color-blue-\d+/,
  /--color-slate-\d+/,
  /--color-zinc-\d+/,
];

function isPrimitiveToken(token) {
  return PRIMITIVE_PATTERNS.some((pattern) => pattern.test(token));
}

const rule = (primaryOption) => {
  return (postcssRoot, postcssResult) => {
    if (!primaryOption) return;

    postcssRoot.walkDecls((decl) => {
      // Look for var(--token-name) calls in values
      const varMatches = decl.value.matchAll(/var\(\s*(--[\w-]+)/g);
      for (const match of varMatches) {
        const tokenName = match[1];
        if (isPrimitiveToken(tokenName)) {
          stylelint.utils.report({
            message: messages.rejected(tokenName),
            node: decl,
            result: postcssResult,
            ruleName,
            word: tokenName,
          });
        }
      }

      // Also check custom property definitions that reference primitives
      if (decl.prop.startsWith('--')) {
        const innerVarMatches = decl.value.matchAll(/var\(\s*(--[\w-]+)/g);
        for (const match of innerVarMatches) {
          const tokenName = match[1];
          if (isPrimitiveToken(tokenName)) {
            stylelint.utils.report({
              message: messages.rejected(tokenName),
              node: decl,
              result: postcssResult,
              ruleName,
              word: tokenName,
            });
          }
        }
      }
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = {
  ruleName,
  rule,
  messages,
  meta,
  rules: { [ruleName.split('/')[1]]: rule },
};

// Export as a plugin
module.exports.default = {
  ruleName,
  rule,
  messages,
  meta,
};
