# Contributing

## Set up your dev environment

We use Node v14 for development - that is the version that our linters require.

To set up the repository:
1. Clone the repository
2. `cd` into the repository
3. Install dependencies with `npm install`

To build the library:
```bash
npm run build
```

## Run the linter

```bash
npm install
npm run lint
```

## Running Tests

For integration and browser tests, we use a `rippled` node in standalone mode to test xrpl.js code against. To set this up, you can either run `rippled` locally, or set up the Docker container `natenichols/rippled-standalone:latest` for this purpose. The latter will require you to [install Docker](https://docs.docker.com/get-docker/).

### Unit Tests

```bash
npm install
npm test
```

### Integration Tests

```bash
npm install
# sets up the rippled standalone Docker container - you can skip this step if you already have it set up
docker run -p 6006:6006 -it natenichols/rippled-standalone:latest
npm run test:integration
```

### Browser Tests

There are two ways to run browser tests.

One is in the browser - run `npm run build:browserTests` and open `test/localIntegrationRunner.html` in your browser.

The other is in the command line (this is what we use for CI) -

```bash
npm run build:browserTests
# sets up the rippled standalone Docker container - you can skip this step if you already have it set up
docker run -p 6006:6006 -it natenichols/rippled-standalone:latest
npm run test:browser
```

## Generate reference docs

You can see the complete reference documentation at [`xrpl.js` docs](js.xrpl.org). You can also generate them locally using `typedoc`:

```bash
npm run docgen
```

## Release process

### Editing the Code

* Your changes should have unit and/or integration tests.
* Your changes should pass the linter.
* Your code should pass all the tests on Github (which check the linter, unit and integration tests on Node 12/14/16, and browser tests).
* Open a PR against `develop` and ensure that all CI passes.
* Get a full code review from one of the maintainers.
* Merge your changes.

### Release

1. Ensure that all tests passed on the last CI that ran on `develop`.
2. Open a PR to update the docs if docs were modified.
3. Create a branch off `develop` that properly increments the version in `package.json` and ensures that `HISTORY.md` is updated appropriately. We follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
  * Use `shasum -a 256 build/*` to get the SHA-256 checksums. Add these to `HISTORY.md` as well.
4. Merge this branch into `develop`.
5. If this is not a beta release: Merge `develop` into `master` (`--ff-only`) and push to github. This is important because we have docs telling developers to use master to get the latest release.
6. Create a new Github release/tag off of this branch.
7. Run `npm publish --dry-run` and make sure everything looks good.
8. Publish the release to `npm`.
  * If this is a beta release, run `npm publish --tag beta`. This allows someone else to install this version of the package with `npm install xrpl@beta`.
  * If this is a stable release, run `npm publish`.
  * This will require entering `npm` login info.
9. Send an email to [xrpl-announce](https://groups.google.com/g/xrpl-announce).

## Mailing Lists
We have a low-traffic mailing list for announcements of new `xrpl.js` releases. (About 1 email every couple of weeks)

+ [Subscribe to xrpl-announce](https://groups.google.com/g/xrpl-announce)

If you're using the XRP Ledger in production, you should run a [rippled server](https://github.com/ripple/rippled) and subscribe to the ripple-server mailing list as well.

+ [Subscribe to ripple-server](https://groups.google.com/g/ripple-server)
