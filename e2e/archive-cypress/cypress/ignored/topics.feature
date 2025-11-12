Feature: Topics pages

  As a user of the Prisoner Content Hub
  I want to be able to browse content with the same topic
  So that I can find related content

  Scenario: I navigate to topic from the home page
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Browse all topics" link
    And select the Topics "Addiction"
    Then I am on the "Addiction" page
    And I see content for that Topics
