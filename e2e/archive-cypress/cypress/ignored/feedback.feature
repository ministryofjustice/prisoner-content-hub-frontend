Feature: Leaving feedback

  As a user of the Prisoner Content Hub
  I want to be able to leave feedback
  So that my voice is heard

  Background: I am on a piece of content
    Given that I am viewing some content

  Scenario: I want to leave some positive feedback
    When I click the Like button
    And I leave a comment
    And I click the "Send" button
    Then my feedback is submitted

  Scenario: I want to leave some negative feedback
    When I click the Dislike button
    And I leave a comment
    And I click the "Send" button
    Then my feedback is submitted
