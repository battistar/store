# Store

Store is a React app that simulate a web store. It's built on [dummyjson.com](https://dummyjson.com) APIs.

Every interaction doesn't make any changes on the backend side (e.g. add or remove items don't change the cart status). For more info, please read the APIs documentation on the above link.

## Setup and run

You can setup and run the application in your local environment in different ways:

### Docker

Move in dev folder and make executable `run.sh`:

```shell
sudo chmod +x run.sh
```

Then you can build the Docker image and run the container by:

```shell
./run.sh start
```

Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

To teardown the environment run:

```shell
./run.sh stop
```

### npm

First setup [nvm](https://github.com/nvm-sh/nvm), then move in the main folder, where the `.nvmrc` file are in, and run:

```shell
nvm use
```

Now you can run the application in dev mode:

```shell
npm start
```

Open [http://localhost:3000](http://localhost:3000) to show it in the browser.
