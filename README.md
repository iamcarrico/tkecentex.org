TKE CenTex Alumni Site
=======================


## Installation

We're using Node.js build tools through gulp. Be sure to install [nvm](https://github.com/creationix/nvm#install-script) first, then you should be able to install the requirements.

```
nvm install
nvm exec npm install --global gulp-cli foreman
nvm exec npm install
```

## Running locally

To load the server locally, run

```
nvm exec npm run dev
```

This will run both the server on port 5000, and the site using Gulp build tools on port 3000. The server will stop and start automatically as you make changes.



## License

The code within this repository is under the [MIT License](LICENSE).
