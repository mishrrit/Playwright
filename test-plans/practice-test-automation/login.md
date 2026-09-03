# Practice Test Automation Login

## Purpose

Validate the login page and its positive and negative authentication behavior at `https://practicetestautomation.com/practice-test-login/`.

## Scope

- Login page loads with the expected controls.
- A valid username and password allow login.
- An invalid username is rejected with the expected error.
- An invalid password is rejected with the expected error.

## Test data

Shared test data is stored in `test-data/practice-test-automation/login.json` and must be imported by the tests.

## Test scenarios

### 1. Validate successful login with valid credentials

- Navigate to `https://practicetestautomation.com/practice-test-login/`.
- Verify the `Test login` heading is visible.
- Verify the `Username` field, `Password` field, and `Submit` button are visible.
- Enter `student` in the `Username` field.
- Enter `Password123` in the `Password` field.
- Click `Submit`.
- Verify the URL contains `practicetestautomation.com/logged-in-successfully/`.
- Verify the page contains `Congratulations` or `successfully logged in`.
- Verify the `Log out` button is visible.

### 2. Reject an invalid username

- Navigate to `https://practicetestautomation.com/practice-test-login/`.
- Enter `incorrectUser` in the `Username` field.
- Enter `Password123` in the `Password` field.
- Click `Submit`.
- Verify an error message is displayed.
- Verify the error message is `Your username is invalid!`.
- Verify the user remains on the login page.

### 3. Reject an invalid password

- Navigate to `https://practicetestautomation.com/practice-test-login/`.
- Enter `student` in the `Username` field.
- Enter `incorrectPassword` in the `Password` field.
- Click `Submit`.
- Verify an error message is displayed.
- Verify the error message is `Your password is invalid!`.
- Verify the user remains on the login page.
