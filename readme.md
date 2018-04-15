[![MIT License][license-badge]][LICENSE]
[![npm version][npm-badge]][npm-link]
[![Build Status][travis-ci-badge]][travis-ci-link]
[![Windows Build status][win-build-badge]][win-build-link]
[![dependencies Status][deps-badge]][deps-link]
[![devDependencies Status][dev-deps-badge]][dev-deps-link]
[![PRs Welcome][prs-badge]][prs]
[![codecov][codecov-badge]][codecov-link]
[![Maintainability][codeclim-badge]][codeclim-link]
[![Known Vulnerabilities][snyk-badge]][snyk-link]
[![Code of Conduct][coc-badge]][coc]

# Alsatian fluent assertions plugin

This is a fluent assertions plugin for the [Alsatian xUnit framework][alsatian], for JavaScript and TypeScript. It provides
a way to chain assertions while narrowing the scope, enabling the clear and concise expression of code specifications for those who prefer
a fluent style. By contrast, the default expectations framework in Alsatian is not currently fluent.

```typescript
Assert(obj)
  .is(SomeType)
  .has(o => o.prop)
  .that.hasMatch(/(\d+)/) // alt 'matches' that returns match result scope
  .that.has(matchParts => +matchParts[0])
  .that.equals(7);

Assert(obj).equals(expected);

Assert(obj).has({
  prop: "user 007",
  other: p => Assert(p).matches(...)
});
```

## Basic Usage & Documentation

Please visit our [wiki].

[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[LICENSE]: https://github.com/ossplz/alsatian-fluent-assertions/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/ossplz/alsatian-fluent-assertions/blob/master/other/code_of_conduct.md
[npm-badge]: https://badge.fury.io/js/alsatian-fluent-assertions.svg
[npm-link]: https://badge.fury.io/js/alsatian-fluent-assertions
[travis-ci-badge]: https://travis-ci.org/ossplz/alsatian-fluent-assertions.svg?branch=master
[travis-ci-link]: https://travis-ci.org/ossplz/alsatian-fluent-assertions
[win-build-badge]: https://ci.appveyor.com/api/projects/status/bl0exqb3w2lp7ra8?svg=true
[win-build-link]: https://ci.appveyor.com/project/cdibbs/alsatian-fluent-assertions
[deps-badge]: https://david-dm.org/ossplz/alsatian-fluent-assertions/status.svg
[deps-link]: https://david-dm.org/ossplz/alsatian-fluent-assertions
[dev-deps-badge]: https://david-dm.org/ossplz/alsatian-fluent-assertions/dev-status.svg
[dev-deps-link]: https://david-dm.org/ossplz/alsatian-fluent-assertions?type=dev
[codecov-badge]: https://codecov.io/gh/ossplz/alsatian-fluent-assertions/branch/master/graph/badge.svg
[codecov-link]: https://codecov.io/gh/ossplz/alsatian-fluent-assertions
[codeclim-badge]: https://api.codeclimate.com/v1/badges/6ff4031198fa28ee42e4/maintainability
[codeclim-link]: https://codeclimate.com/github/ossplz/alsatian-fluent-assertions/maintainability
[snyk-badge]: https://snyk.io/test/github/ossplz/alsatian-fluent-assertions/badge.svg?targetFile=package.json
[snyk-link]: https://snyk.io/test/github/ossplz/alsatian-fluent-assertions?targetFile=package.json
[alsatian]: https://github.com/alsatian-test/alsatian
[wiki]: https://github.com/ossplz/alsatian-fluent-assertions/wiki