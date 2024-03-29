module.exports = {
  extends: ["universe/native"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["babel", "react"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        printWidth: 120,
      },
    ],
  },
};
