Feature: Money

  As a user of the Prisoner Content Hub
  I want to be able to check my account balances
  So that I can manage my money

  Scenario: I want to navigate to the money page
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Money & debt" link
    Then I am on the "Money and Debt" page
    And I see related content for that category

  Scenario: I want my balances to be hidden when i am signed out
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Money & debt" link
    Then my account balance information is not visible on the page

  Scenario: I want to my balances to be shown when i am signed in
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Money & debt" link
    Then I am on the "Money and Debt" page
    When I click the "Sign in" link
    Then my account balance information is visible on the page
