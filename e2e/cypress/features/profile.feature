Feature: Profile

  As a user of the Prisoner Content Hub
  I want to be able to sign into my profile
  So that I see my profile information

  Scenario: I want to see the profile page
    Given that with an "wayland" content hub url, I go to the "profile" page
    Then I am displayed the "Sign in" link

  Scenario: I want to see the try again buttons when the services are unavailable
    Given that with an "wayland" content hub url, I go to the "profile" page
    Then I am displayed the "Sign in" link
    And I log into the hub
    Then I am displayed the "try again" link in "timetable-container"
    Then I am displayed the "Try again" link in "incentive-container"
    Then I am displayed the "Try again" link in "money-container"
    Then I am displayed the "Try again" link in "visits-container"

  Scenario: I want to view a summary of my timetable today
    Given that with an "wayland" content hub url, I go to the "profile" page
    When I have the following up coming events
      | type     | start | end   | name       | location   |
      | activity | 08:10 | 11:25 | activity-1 | location-1 |
      | activity | 11:25 | 12:00 | activity-2 | location-2 |
      | activity | 13:35 | 16:45 | activity-3 | location-3 |
    And I log into the hub
    Then I am shown the following card
      | card    | morningEvents      |
      | title   | Morning            |
      | content | activity-1         |
      | content | 8:10am to 11:25am  |
      | content | Location-1         |
      | content | activity-2         |
      | content | 11:25am to 12:00pm |
      | content | Location-2         |
    Then I am shown the following card
      | card    | afternoonEvents  |
      | title   | Afternoon        |
      | content | activity-3       |
      | content | 1:35pm to 4:45pm |
      | content | ocation-3        |
    Then I am shown the following card
      | card    | eveningEvents           |
      | title   | Evening                 |
      | content | No activities scheduled |

  Scenario: I want to view my incentives
    Given that with an "wayland" content hub url, I go to the "profile" page
    When I have the following incentives
      | level | date       |
      | Basic | 2017-03-08 |
    And I log into the hub
    Then I am shown the following card
      | card    | currentLevel                    |
      | title   | Your current incentive level is |
      | content | Basic                           |
    Then I am shown the following card
      | card    | reviewDate                |
      | title   | This can be reviewed from |
      | content | Thursday 8 June 2017      |
    Then I am shown the following card
      | card  | incentivesLink                   |
      | title | Read more about incentive levels |

  Scenario: I want to view a summary of my money
    Given that with an "wayland" content hub url, I go to the "profile" page
    When I have the following money summary
      | spends   | 123.45 |
      | cash     | 5      |
      | savings  | 9      |
      | currency | GBP    |
    And I log into the hub
    Then I am shown the following closed sensitive card
      | card          | moneySpends                    |
      | title         | Spends                         |
      | content       | Spends account current balance |
      | closedContent | £123.45                        |
    Then the "moneySpends" sensitive card is closed
    When I click on the "moneySpends" card
    Then the "moneySpends" sensitive card is open
    Then I am shown the following closed sensitive card
      | card          | moneyPrivate                    |
      | title         | Private                         |
      | content       | Private account current balance |
      | closedContent | £5.00                           |
    Then the "moneyPrivate" sensitive card is closed
    When I click on the "moneyPrivate" card
    Then the "moneyPrivate" sensitive card is open
    Then I am shown the following closed sensitive card
      | card          | moneySavings                    |
      | title         | Savings                         |
      | content       | Savings account current balance |
      | closedContent | £9.00                           |
    Then the "moneySavings" sensitive card is closed
    When I click on the "moneySavings" card
    Then the "moneySavings" sensitive card is open
    Then I am shown the following card
      | card  | moneyLink              |
      | title | View your transactions |
    Then I click the "Close all balances" link
    Then the "moneySpends" sensitive card is closed
    Then the "moneyPrivate" sensitive card is closed
    Then the "moneySavings" sensitive card is closed
    Then I click the "Open all balances" link
    Then the "moneySpends" sensitive card is open
    Then the "moneyPrivate" sensitive card is open
    Then the "moneySavings" sensitive card is open
    When I click on the "moneyPrivate" card
    Then I click the "Close all balances" link
    Then the "moneySpends" sensitive card is closed
    Then the "moneyPrivate" sensitive card is closed
    Then the "moneySavings" sensitive card is closed

  Scenario: I want to view visit information on the profile page
    Given that with an "wayland" content hub url, I go to the "profile" page
    When I have the following visit
      | startTime           | endTime             | visitType | visitors                 |
      | 2021-12-12T09:00:00 | 2021-12-12T09:59:00 | SCON      | Bob Visitor, Pam Visitor |
    And I have the the following remaining visits
      | remainingPvo | remainingVo |
      | 20           | 4           |
    And I log into the hub
    Then I am shown the following card
      | card    | nextVisit          |
      | title   | Your next visit    |
      | content | Sunday 12 December |
      | content | 9:00am to 9:59am   |
    Then I am shown the following card
      | card    | visitsRemaining        |
      | title   | Total visits remaining |
      | content | 24                     |
    Then I am shown the following closed sensitive card
      | card          | visitors                            |
      | title         | Visitors coming to your next visit  |
      | content       | See who’s coming to your next visit |
      | closedContent | Bob Visitor                         |
      | closedContent | Pam Visitor                         |
    # Then I am shown the following card
    #   | card  | approvedVisitors                         |
    #   | title | View your full list of approved visitors |
    Then the "visitors" sensitive card is closed
    When I click on the "visitors" card
    Then the "visitors" sensitive card is open
