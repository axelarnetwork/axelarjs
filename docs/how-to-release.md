# Release Process

This document describes how to release new versions of the packages in the `@axelar-network` monorepo and deploy the ITS website.

**Table of Contents:**
- [Release Process](#release-process)
  - [Release Packages to NPM](#release-packages-to-npm)
    - [1. Update the Changeset File](#1-update-the-changeset-file)
    - [2. Commit the Changeset File](#2-commit-the-changeset-file)
    - [3. Merge the PR](#3-merge-the-pr)
    - [4. Publish packages to NPM](#4-publish-packages-to-npm)
  - [Deploy ITS website](#deploy-its-website)
  - [Relevant Links](#relevant-links)

## Release Packages to NPM

To release a new version, follow these steps after creating a PR with your changes:

### 1. Update the Changeset File

In your branch, at the root directory, run the following command to create a new changeset file:

```bash
pnpm cs
```

First, you'll be prompted to specify the package you are releasing. Choose the package you are releasing from the list of packages in the monorepo.

Hit `Space` to select the package you are releasing, then hit `Enter` to continue.

Next, you will be prompted to specify the type of changes you are making.
- `major`: breaking changes, etc.
- `minor`: new features, non-breaking changes, etc.
- `patch`: bug fixes, documentation updates, etc.

Finally, you will be prompted to enter a summary of the changes you made. This will be used to generate the release notes in the `CHANGELOG.md` file.

### 2. Commit the Changeset File

```bash
git add .
git commit -m "chore: update changeset"
git push
```

### 3. Merge the PR

Once the PR is merged into the main branch, a release PR will be automatically created by [this workflow](https://github.com/axelarnetwork/axelarjs/actions/workflows/changesets_version_pr.yml). This PR will:
   - Update the `CHANGELOG.md` file with the changes made in the release.
   - Bump the version number of the package.

### 4. Publish packages to NPM

After the release PR is merged, you have to trigger the [publish workflow](https://github.com/axelarnetwork/axelarjs/actions/workflows/publish_version.yml) manually to publish the packages to NPM.

## Deploy ITS website

1. Merge `main` branch to `env/testnet` to trigger vercel deployment for testnet.
2. If everything looks good, merge `env/testnet` to `env/mainnet` to trigger vercel deployment for mainnet.

## Relevant Links

- [Vercel Deployment](https://vercel.com/axelar-network/axelar-maestro)
- [ITS Testnet](https://testnet.interchain.axelar.dev/)
- [ITS Mainnet](https://interchain.axelar.network/)
