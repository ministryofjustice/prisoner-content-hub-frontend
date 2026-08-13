Feature: Application Health Check

  As a system administrator
  I want to monitor the application health status
  So that I can ensure the application is running correctly

  Scenario: Check application health status
    Given the application is running
    When I request the health endpoint
    Then the status should be "UP"
    And the response should include health information

  Scenario: Check application uptime
    Given the application is running
    When I request the health endpoint
    Then the uptime should be greater than 0

  Scenario: Check application readiness
    Given the application is running
    When I request the readiness endpoint
    Then the readiness status should be "UP"
