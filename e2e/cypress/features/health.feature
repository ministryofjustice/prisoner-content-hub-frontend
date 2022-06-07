Feature: Health

  As a user of the Prisoner Content Hub
  I want to be able to check the health of the app
  So that I know the app is healthy

  Scenario: Accessing the health endpoint
    Given that with an "cookhamwood" content hub url, I request "health" page
    Then the request response contains a health status

