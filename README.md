# Vehicle Api

Add, update and delete vehicles and dealers. And list all the vehicles of particular dealer.

## Setup

### Docker MongoDB (local)

Add env. variable

```
MONGODB_DEVELOPMENT_URL=mongodb://root:example@mongo:27017/mongo
```

```
$ npm run infra:start
```

### Terraform MongoDB (Real environment)

Add env. variable

```
MONGODB_TEST_URL={your_url}
```

```
$ npm run infra:init
$ npm run infra:apply
```

### Postman Collection

https://app.swaggerhub.com/apis/furkantopal/vehicle-api/1.0.0

## Run

```
$ npm run start
```
