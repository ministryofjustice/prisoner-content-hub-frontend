Feature: Secondary Tag pages

  As a user of the Prisoner Content Hub
  I want to be able to browse content with the same secondary tag
  So that I can find related content

  Scenario: I navigate to a secondary tag from the home page
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Browse all topics" link
    And select the Secondary Tag "Addiction"
    Then I am on the "Addiction" page
    And I see content for that Secondary Tag
