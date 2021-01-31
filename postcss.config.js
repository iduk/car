module.exports = {
  parser: "sugarss",
  plugins: [
    require("postcss-import")({ ...options }),
    require("postcss-url")({ url: "copy", useHash: true }),
    require("autoprefixer"),
    require("postcss-flexbugs-fixes"),
    require("postcss-fail-on-warn")
  ]
};
