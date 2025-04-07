# Forgejo Actions Collection

[![GitHub Super-Linter](https://github.com/vicamo/forgejo-actions/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/vicamo/forgejo-actions/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/vicamo/forgejo-actions/actions/workflows/check-dist.yml/badge.svg)](https://github.com/vicamo/forgejo-actions/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/vicamo/forgejo-actions/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/vicamo/forgejo-actions/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## Actions

### actions/version

<!-- start usage -->

```yaml
- uses: vicamo/forgejo-actions/actions/version@v1
  with:
    # The server URL for the Forgejo instance that you are connecting to. Will
    # use environment defaults from the same instance that the workflow is
    # running from unless specified. Example URL is https://forgejo.org.
    #
    # Default: ${{ github.server_url }}
    server_url: ''

    # Access Token used to authenticate the query.
    #
    # Learn more about [Generating and listing API
    # tokens](https://forgejo.org/docs/latest/user/api-usage/#generating-and-listing-api-tokens).
    #
    # Default: ''
    token: ''
```

<!-- end usage -->

#### inputs

The following inputs can be used as `step.with` keys:

| Name         | Type   | Default                    | Description     |
| :----------- | ------ | :------------------------- | :-------------- |
| `server_url` | String | `${{ github.server_url }}` | The server URL. |
| `token`      | String | ''                         | Access Token.   |

#### outputs

The following outputs are available:

| Name      | Type   | Description            |
| :-------- | ------ | :--------------------- |
| `version` | String | Server version string. |
