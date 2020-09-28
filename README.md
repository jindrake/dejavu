## Global dev dependencies
* node
* yarn

## Environment variables
create file `/app/.env`
```
SKIP_PREFLIGHT_CHECK=true
```

## To start the app initially
* In the root

  * `yarn` to install all the dependencies on all the workspaces
  * `cd /services && yarn start` to start the server
* To run the frontend, go to `/app` directory and `yarn start`
