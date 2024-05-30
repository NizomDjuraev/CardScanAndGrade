# CardScanAndGrade

**Card Scanner and Grader App** using React Native and Expo to simplify the mobile development process.

## Overview

CardScanAndGrade is a mobile application designed to scan and grade cards efficiently. Developed using React Native within the Expo Go environment, this app leverages modern tools to streamline mobile development and provide a seamless user experience.

## Features

- **Scan cards** using your mobile device's camera.
- Automatically **grade cards** based on predefined criteria.
- Easy setup and deployment using Expo Go.

## Architecture

Our codebase is written in JavaScript using React Native, enabling compatibility with both iOS and Android platforms through the Expo development environment. This approach allows a sped up the development process by focusing on a single codebase.

React Native enables the use of modular UI components as the building blocks of the application, promoting reusability and efficient UI development.

- **Firebase**: Used for OAuth to provide secure user authentication, as well as for the login and account creation processes. Unique tokens generated through Firebase are used for backend API calls.
- **AWS**: Used to host user collections, assist with backend API calls, and store all application data. Specifically, we use AWS RDS to host two schemas and an API Gateway as the trigger for AWS Lambda functions.

### AWS Architecture Details

The AWS portion includes an API Gateway that triggers the `Frontend-Card-Collections` Lambda function, which contains the `index.js` file that needs to be updated if any backend changes are needed for the frontside application

## Code Documentation

Every important method and function in the codebase is commented using JSDoc styled comments. This ensures readability and ease of understanding for developers. JSDoc comments provide clear documentation of parameters, return values, and functionality, making it easier to maintain and extend the code.

Example of JSDoc comments:

```javascript
/**
 * Scans a card using the device camera.
 * @param {Object} card - The card object containing card details.
 * @returns {Object} The result of the scan with grading information.
 */
function scanCard(card) {
  // Function implementation
}
```

## Environment Setup

Follow these steps to set up the development environment:

1. Clone the repository to your local machine.
2. Navigate to the root directory of the project.
3. Run the following command to install all necessary packages and dependencies:
   ```bash
   npm install
   ```
4. Start the development server
   ```bash
   npm start
   ```


## Running the App

Once the Metro bundler has finished, you have several options to run the app:

1. **Switch to Expo Dev Environment**: Press `s` to switch to the Expo dev environment.
2. **View on Mobile Device**:
   - Install the Expo Go mobile application from your app store.
   - Scan the QR code displayed in the terminal to view the app on your phone.
3. **Open in Android Emulator**: Press `a` to open the app in an Android emulator.
4. **Reload the App**: Press `r` to reload the app.
