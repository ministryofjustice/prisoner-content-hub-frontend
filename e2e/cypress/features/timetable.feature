Feature: Timetable

  As a user of the Prisoner Content Hub
  I want to be able to check my timetable
  So that I know my schedule

  Scenario: Accessing the timetable page when I am signed out
    Given that I go to the "timetable" page
    Then I am displayed the "Sign in" link

  Scenario: I want to see my time table
    Given that I go to the "timetable" page
    
    When I have the following up coming events
    | type         | when      | start  | end    | name        | location   |
    | activity     | today     | 11:00  | 12:00  | activity-1  | location-1 |
    | activity     | today     | 12:00  | 13:00  | activity-2  | location-2 |
    | activity     | today     | 16:00  | 17:00  | activity-3  | location-3 |
    | activity     | today     | 17:00  | 18:00  | activity-4  | location-4 |
    | appointment  | tomorrow  | 11:00  | 12:00  | appoint-1   | location-1 |
    | appointment  | tomorrow  | 12:00  | 13:00  | appoint-2   | location-2 |
    | appointment  | tomorrow  | 16:00  | 17:00  | appoint-3   | location-3 |
    | appointment  | tomorrow  | 17:00  | 18:00  | appoint-4   | location-4 |
    
    And I log into the hub
    
    Then I am shown my time table
      | type      | 8:30am to 12:00pm | 12:00pm to 5:00pm     | 5:00pm to 7:30pm |
      | Today     | activity-1        | activity-2,activity-3 | activity-4       |
      | Tomorrow  | appoint-1         | appoint-2,appoint-3   | appoint-4        |
 

