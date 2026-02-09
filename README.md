# QA Wolf Public Documentation / Help Center

This is a [Mintlify](https://www.mintlify.com/) repository that houses our public documentation.

## Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint) to preview your documentation changes locally. To install, run the following commands:

```
nvm use
npm i -g npm
npm i -g mint
```

Run the following command at the root of this repo:

```
mint dev
```

View your local preview at `http://localhost:3000`.

## Publishing changes

Changes are deployed to production automatically after pushing to the `main` branch.

## Need help?

### Troubleshooting

- If your dev environment isn't running: Run `mint update` to ensure you have the most recent version of the CLI.
- If a page loads as a 404: Make sure you are running in a folder with a valid `docs.json`.

### Resources

- [Mintlify documentation](https://mintlify.com/docs)
