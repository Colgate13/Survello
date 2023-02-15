/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  clearMocks: true,
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts", "**/*.test.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text-summary", "lcov", "html", "json", "text", "clover"],
};
