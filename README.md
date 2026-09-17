# GitHub Pages frontend
Put this folder at repository root and enable GitHub Pages.

The frontend is intentionally a static shell. Do not put GAS secrets or sheet IDs into `config.js`.

For passkeys, HTTPS is required and the relying-party ID is the GitHub Pages host. The Core service must issue and verify challenges server-side.
