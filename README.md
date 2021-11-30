## Architecture
The email microservice is responsible for sending emails to intended recipients upon
1. receiving a REST api request to mail,
2. receiving an event from other microservices asynchronously via RabbitMQ queue.

It uses 3rd party email delivery services to do the actual job of mailing management. Email delivery service provider and API key can be configured in '.env' file. If no provider is configured, it will use base `MailService` that throws error to notify the end user that service provider is not setup. 

Whether it's from REST api or event from RabbitMQ, `AppController` will handle it with `AppService`. In case of further enrichment of data such as calling another endpoint for data or html templating for email content, it should be done in `enrichMailData` function.

A test REST endpoint is also created to test-publish event to test the consumption of event in local, test environment.

The microservice is structured with dependency injection of the services, especially `MailService` where 3rd party mail delivery service can be dynamically configured, without affecting the application codes.

The microservice is dockerized with Dockerfile config and it can be easily spun up by `docker-compose up` that will run RabbitMQ server and this service.

## Local Setup & Run
### Install the dependencies
```
npm i -g @nestjs/cli
yarn
```

### Run the service locally
- Run rabbit-mq server locally
- Run the service
```
yarn start
```

### Linting
```
yarn lint
```

### Run Unit Tests
```
yarn test
```

## Production Setup & Run
```
docker-compose up
```

## APIs
### Service status API
- URL: localhost:3000/
- Method: GET
- Expected Response: 
```
Email service is running in local environment.
```

### Mail API
- URL: localhost:3000/mail
- Method: POST
- BODY: 
```
{
   "to": "oaksoekyaw@gmail.com",
   "subject": "emailing",
   "content": "general content"
}
```
- Expected Response with SendGrid API Key set: 
```
{
  "statusCode": 200,
  "message": "true"
}
```
- Expected Response with Invalid API Key: 
```
{
  "statusCode": 500,
  "message": "Exception occurred while sending mail using SendGrid: Unauthorized"
}
```

### Test Event API
- URL: localhost:3000/testEvent
- Method: POST
- BODY: 
```
{
   "users":[{
       "id": "1",
       "username": "oaksoekyaw"
   }],
   "subject": "emailing",
   "content": "general content"
}
```
- Expected Response with SendGrid API Key set: 
```
Test event is published.
```
