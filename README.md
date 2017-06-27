# Retool

Retool is a tool that helps you quickly build out web interfaces around your database.

## Getting Started

### Running locally

Setting up Retool to run on your local machine is easy

1. Clone this repository and `cd` in.
2. Install node if you have not already (we recommend using nvm to install node https://github.com/creationix/nvm)
3. Run `./scripts/run_locally`
  * This will install all the dependencies, initialize the database, and start the server.
4. Open up localhost:3000 to get started!

> Note that when running locally, logging in via Google will not work - signup locally via username & password to start.

### Docker

Setting up Retool with Docker is easy.

1. Clone this repository and `cd` in.
2. `./docker_setup` to set up your environment variables
  * If you're hosting this on the internet, use the hostname of your Retool API
    server which you set up (e.g. retool.company.com)
  * If you're testing this locally, just use `localhost` as the hostname
3. `docker-compose build`
4. `docker-compose up`
5. Navigate to `localhost:3000` and make an account.
6. Connect a database
  * If your database is hosted externally (i.e. not on the same host as your
    Docker host), just use the external hostname (e.g. `abc.def.us-east-1.rds.amazonaws.com`)
  * If your database is hosted on your Docker host:
    * First, edit your `postgresql.conf`, and change your `listen_addresses` to ```listen_addresses = '*' ;```
    * Then, edit your `pg_hba.conf` by adding this line: `host    all all 0.0.0.0/16 md5`

    * If you're on Linux, run `ifconfig` and find the `inet addr` of the
      `docker0` interface. Use that as the hostname (e.g. `172.17.0.1`)
    * If you're on Mac, you'll need to set a static IP address:
    `$ sudo ifconfig lo0 alias 10.200.10.1/24`, then use `10.200.10.1` as the hostname from inside the Docker container.

To use Hammerhead in Docker, clone this repository. Then, `cd` in, and run
`./docker-setup`, which sets up the environment variables. If you're hosting
this on the internet, use the hostname of your Retool API server (e.g.
retool.company.com); if you're testing this on your local machine, just type in
`localhost`.

