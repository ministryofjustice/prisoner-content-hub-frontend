Feature: Video content tile navigation
  As a user of the Prisoner Content Hub
  I want to open a video from the homepage
  So that I can watch the video content

  Background:
    Given I am on the Prisoner Content Hub homepage

  Scenario: Homepage video tile navigates to content page
    Then a video tile should be visible
    When I open the video tile
    Then I should be on the video content page
    And the video should be able to play
