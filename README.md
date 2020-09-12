One America Appeal Website
==========================


## Installation

We're using Node.js build tools through gulp. Be sure to install [nvm](https://github.com/creationix/nvm#install-script) first, then you should be able to install the requirements.

```
nvm install
nvm exec npm install --global gulp-cli foreman
nvm exec npm install
```

You will also need to create a `.env` that will contain all local secrets. Right now, that is just the Stripe testing API key. You can get it by logging onto the Stripe dashboard.

```
STRIPE_SECRET_KEY=sk_test_**************
```

## Running locally

To load the server locally, run

```
nvm exec npm run dev
```

This will run both the server on port 5000, and the site using Gulp build tools on port 3000. The server will stop and start automatically as you make changes.


## Deployment

We deploy to a simple S3 bucket. You will need an `~/.aws/credentials` file. And you know, access to the bucket.

```
AWS_PROFILE=default nvm exec gulp publish
```

Alternatively, you can deploy to staging by running

```
AWS_PROFILE=default nvm exec gulp publish-staging
```


## License

The code within this repository is under the [MIT License](LICENSE).
