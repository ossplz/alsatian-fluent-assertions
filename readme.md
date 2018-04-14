[![npm version][npm-badge]][npm-link]
[![Build Status][travis-ci-badge]][travis-ci-link]
[![Windows Build status][win-build-badge]][win-build-link]
[![dependencies Status][deps-badge]][deps-link]
[![devDependencies Status][dev-deps-badge]][dev-deps-link]
[![codecov][codecov-badge]][codecov-link]
[![MIT License][license-badge]][LICENSE]
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

# Alsatian fluent assertions plugin

This is a fluent assertions plugin for the [Alsatian xUnit framework][alsatian], for JavaScript and TypeScript. It provides
a way to chain assertions while narrowing the assertion scope, enabling the clear and concise expression of your code
specifications.

```typescript
Assert(obj)
  .is(SomeType)
  .has(o => o.prop)
  .that.hasMatch(/(\d+)/) // alt 'matches' that returns match result scope
  .that.has(matchParts => +matchParts[0])
  .that.equals(3);
Assert(obj).equals(expected);
Assert(obj).has({
  myProp: 3,
  other: p => Assert(p).matches(...)
});
```

## Basic Usage & Documentation

Please visit our [wiki] for an overview of the fluent assertions API.

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
[win-build-badge]: https://ci.appveyor.com/api/projects/status/6ngl64ck83opvekl?svg=true
[win-build-link]: https://ci.appveyor.com/project/cdibbs/alsatian-fluent-assertions
[deps-badge]: https://david-dm.org/ossplz/alsatian-fluent-assertions/status.svg
[deps-link]: https://david-dm.org/ossplz/alsatian-fluent-assertions
[dev-deps-badge]: https://david-dm.org/ossplz/alsatian-fluent-assertions/dev-status.svg
[dev-deps-link]: https://david-dm.org/ossplz/alsatian-fluent-assertions?type=dev
[codecov-badge]: https://codecov.io/gh/ossplz/alsatian-fluent-assertions/branch/master/graph/badge.svg
[codecov-link]: https://codecov.io/gh/ossplz/alsatian-fluent-assertions
[alsatian]: https://github.com/alsatian-test/alsatian
[wiki]: https://github.com/ossplz/alsatian-fluent-assertions/wiki