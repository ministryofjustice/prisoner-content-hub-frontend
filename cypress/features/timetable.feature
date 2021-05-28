Feature: Timetable

  As a user of the Prisoner Content Hub
  I want to be able to check my timetable
  So that I know my schedule

  Scenario: Accessing the timetable page when I am signed out
    Given that I go to the "timetable" page
    Then I am displayed the "Sign in" link

  Scenario: I want to see my time table
    Given that I go to the "timetable" page
    When I am logged in to the hub
    Then I am shown my time table
 

