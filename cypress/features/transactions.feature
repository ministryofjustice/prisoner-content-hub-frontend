Feature: Money

  As a user of the Prisoner Content Hub
  I want to be able to check my transactions
  So that I can manage my money

  Background: I am signed in and on the money page
    Given that I am signed in on the money page

  Scenario: I want to navigate to the Transactions page
    When I click the "view your transactions" link
    Then I am on the "Transactions" page




