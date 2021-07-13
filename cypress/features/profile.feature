Feature: Profile

  As a user of the Prisoner Content Hub
  I want to be able to sign into my profile
  So that I see my profile information

  Scenario: I want to see the profile page
    Given that I go to the "profile" page
    Then I am displayed the "Sign in" link

  Scenario: I want to view visit information on the profile page
    Given that I go to the "profile" page
    When I have the following visits
    | startTime           | endTime             | visitType | visitors                  |
    | 2021-12-12T09:00:00 | 2021-12-12T09:59:00 | SCON      | Bob Visitor, Pam Visitor  |
    And I have the the following remaining visits
    | remainingPvo  | remainingVo |
    | 20            | 4           |
    And I log into the hub
    Then I am shown the following card
    | dataTest  | nextVisit           |
    | title     | Your next visit     |
    | content   | Sunday 12 December  |
    | content   | 9:00am to 9:59am    |
    Then I am shown the following card
    | dataTest  | visitsRemaining         |
    | title     | Total visits remaining  |
    | content   | 24                      |
    Then I am shown the following closed sensitive card
    | dataTest  | visitors                            |
    | title     | Visitors coming to your next visit  |
    | content   | See who’s coming to your next visit |
    | sensitive | Bob Visitor                         |
    | sensitive | Pam Visitor                         |
    Then the "visitors" sensitive card is closed
    When I click on the "visitors" card
    Then the "visitors" sensitive card is open