Feature: Homepage Accessibility
  As a user of the Prisoner Content Hub
  I want the homepage to meet accessibility expectations
  So that I can navigate and use it successfully

  Background:
    Given I am on the Prisoner Content Hub homepage

  Scenario: Homepage can be scanned for accessibility issues
    When I run automated accessibility checks
    Then accessibility scan should complete successfully

  Scenario: Homepage navigation buttons are visible and configured
    Then the primary navigation should be visible
    And each navigation button should be visible with a valid link
    And navigation buttons should be keyboard accessible
