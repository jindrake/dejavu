## Global dev dependencies
* node
* yarn

## To start the app
* In the root

  * `yarn` to install all the dependencies on all the workspaces
  * `cd /services/sql`
    * run the `.sql` files in the order of: 
      * public-schema.sql
      * functions.sql
      * access.sql

* to start the server go to ` /services` directory and execute command `yarn start`
* To run the frontend, go to `/app` directory and execute command`yarn start`
