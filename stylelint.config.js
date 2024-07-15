// 配置参考
// https://stylelint.io/user-guide/rules
// https://github.com/stylelint-scss/stylelint-scss#list-of-rules
export default {
  defaultSeverity: "error",
  extends: [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-recommended",
    "stylelint-config-recommended-vue",
    "stylelint-config-html",
    "stylelint-config-recess-order"
  ],
  plugins: [
    "stylelint-order"
  ],
  rules: {
    "unit-no-unknown": null,
    "no-empty-source": null,
    "color-hex-length": ["long", {
      message: "16进制颜色需要使用长符号(#ffffff)风格"
    }],
    "at-rule-no-unknown": null,
    "value-keyword-case": null,
    "length-zero-no-unit": [true, {
      ignore: ["custom-properties"],
      ignoreFunctions: ["/^--/", "var", "calc"]
    }],
    "alpha-value-notation": ["number"],
    "selector-not-notation": null,
    "no-duplicate-selectors": null,
    "selector-class-pattern": ["^([#a-z][$#{}a-z0-9]*)((-{1,2}|_{2})[$#{}a-z0-9]+)*$", {
      message: "class命名需要符合BEM风格(block-element[__element][--modifier])"
    }],
    "color-function-notation": ["legacy", {
      ignore: ["with-var-inside"]
    }],
    "font-family-name-quotes": null,
    "no-descending-specificity": null,
    "selector-type-no-unknown": [true, {
      ignore: ["custom-elements", "default-namespace"],
      ignoreTypes: ["page", "rich-text", "scroll-view"]
    }],
    "selector-pseudo-class-no-unknown": [true, {
      ignorePseudoClasses: ["deep"]
    }],
    "custom-property-empty-line-before": null,
    "font-family-no-missing-generic-family-keyword": null,
    "declaration-block-no-redundant-longhand-properties": [true, {
      ignoreShorthands: ["inset"]
    }],
    "scss/at-import-partial-extension": ["always"],
    "scss/at-extend-no-missing-placeholder": null
  }
};