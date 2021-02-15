Feature: Timetable

  As a user of the Prisoner Content Hub
  I want to be able to check my timetable
  So that I know my schedule

  Scenario: I want to see today events on the home page
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Sign in" link
    Then I am displayed todays timetable

  Scenario: I want to navigate to the timetable from the home page
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Sign in" link
    And click the "See your timetable"
    Then I am on the "Timetable" page


