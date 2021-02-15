Feature: Incentives

  As a user of the Prisoner Content Hub
  I want to be able to see my incentive level
  And know my next review date
  So that i can improve or maintain my priviledges

  Scenario: I want to navigate to the Incentives page
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Incentive level" link
    Then I am on the "Incentive level" page
    And I see related content for that category

  Scenario: I want my Incentive level to be hidden when I am signed out
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Incentive" link
    Then my Incentive level information is not visible on the page

  Scenario: I want my Incentive level to be shown when I am signed in
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Incentive level" link
    Then I am on the "Incentive level" page
    When I click the "Sign in" link
    Then my Incentive level is displayed on the page
