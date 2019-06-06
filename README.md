## Global dev dependencies
* hasura-cli
* docker cli
* docker-compose cli
* node
* yarn

## Environment variables
create file `/app/.env`
```
SKIP_PREFLIGHT_CHECK=true
```

## To start the app initially
* In the root
  * `docker-compose up -d` to build the containers for the app
    * to ensure that it is successful, type `docker ps -a` in the command line and see if the status of forrevs_graphql and forrevs_postgres is `Up`. You can also go to [hasura console](http://localhost:8081) with access key `test`

  * `yarn` to install all the dependencies on all the workspaces
* to run the frontend, go to `/app` directory and `yarn start`
