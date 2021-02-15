Feature: Visits

  As a user of the Prisoner Content Hub
  I want to be able to see my visit information
  So that I know who is coming to see me and when

  Scenario: I want to navigate to the visits page
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Visits" link
    Then I am on the "Visits" page
    And I see related content for that category

  Scenario: I want visits information to be hidden when I am signed out
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Visits" link
    Then my visits information is not visible on the page

  Scenario: I want to navigate to the Timetable page from the visits page
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Visits" link
    And click the "View your full timetable"
    Then I am on the "Timetable" page

    sign in
