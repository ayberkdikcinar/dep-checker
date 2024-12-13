## Project Structure

The project is organized as follows:

- **src**: Contains the main source code for the application.
  - **lib**: Contains utility functions, API clients, and configuration files.
  - **services**: Contains the core services for parsing files and checking for deprecated packages.
  - **routes**: Contains the route handlers for the API endpoints.
  - **data**: Contains data-related files such as collections and JSON files.
  - **docs**: Contains Swagger documentation for the API.
  - **middlewares**: Contains middleware functions for error handling and logging.
  - **queue**: Contains queue initialization and job processing logic.

## General Information

1. **API Documentation**: The API is documented using Swagger. You can access the API documentation at `/api-docs` after starting the server.
2. **Environment Variables**: The application requires several environment variables to be set. These include `REDIS_HOST`, `REDIS_PASSWORD`, `EMAIL_ADDRESS`, and `EMAIL_PASSWORD`. Make sure to create a `.env` file with these variables.
3. **Job Queue**: The application uses Bull for job queue management. Ensure that Redis is running and accessible using the provided environment variables.
4. **File Parsing**: The application supports parsing `package.json` and `composer.json` files to extract dependency information.
5. **Version Checking**: The application checks for the latest versions of dependencies from npm and Packagist registries.
6. **Email Notifications**: The application sends daily email notifications with the list of outdated packages to the provided email addresses.
7. **Error Handling**: The application includes comprehensive error handling and logging using Winston.

## Configuration of the Gmail

> [!IMPORTANT]  
> To send an email via Gmail, the account specified by the `EMAIL_ADDRESS` environment variable must create an app password. This app password should then be used as the value for the `EMAIL_PASSWORD` environment variable. You can create an app password in your Google account settings under "Security" -> "App passwords".

## Docker-Compose

The project includes Docker and Docker-Compose configurations to simplify the setup and deployment process.

### Using Docker-Compose

1. **Start Services**: Run `docker-compose -f infra/compose.yaml up` to start the application and Redis services.
2. **Stop Services**: Run `docker-compose -f infra/compose.yaml down` to stop the services.

These steps will ensure that the application and its dependencies are correctly set up and running in isolated environments.

## Getting Started

1. **Install Dependencies**: Run `npm install` to install all required dependencies.
2. **Build the Project**: Run `npm run build` to compile the TypeScript code.
3. **Start the Server**: Run `npm start` to start the server.
4. **Run Tests**: Run `npm test` to execute the test suite.
