Feature: Browse all topics

  As a user of the Prisoner Content Hub
  I want to be able to browse all the topics
  So that I can I can find related content

  Scenario: I go to the "Browse all topics" page
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Browse all topics" link
    Then I am taken to the "Browse the Content Hub" page
    And I am presented with a selection of topics
