Feature: Approved visitors

  As a user of the Prisoner Content Hub
  I want to be able to sign into my profile
  So that I see my approved visitors list

  Scenario: I want to see the approved-visitors page
    Given that I go to the "approved-visitors" page
    Then I am displayed the "Sign in" link

  Scenario: I want to see the try again buttons when the service is unavailable
    Given that I go to the "approved-visitors" page
    Then I am displayed the "Sign in" link
    And I log into the hub
    Then I am displayed the "try again" link in "approved-visitors-error"

  Scenario: I want to see that I have no approved visitors
    Given that I go to the "approved-visitors" page
    When I have no approved visitors
    And I log into the hub
    Then I am told I have no visitors

  Scenario: I want to see my sorted approved visitors
    Given that I go to the "approved-visitors" page
    When I have the following approved visitors
    | firstName | lastName         | createdDate                | numberOfVisitors  | nextOfKin | active  | approved  |
    | Test      | Visitor1         | 2007-07-29T04:17:40.59704  | 5                 | true      | true    | true      |
    | Test      | Visitor2         | 2007-06-29T04:17:40.59704  | 5                 | false     | true    | true      |
    | Test      | Visitor3         | 2007-08-29T04:17:40.59704  | 5                 | true      | true    | true      |
    | Test      | Visitor3         | 2007-09-29T04:17:40.59704  | 5                 | true      | true    | false      |
    And I log into the hub
    Then I see the following approved visitors
    | name          | count |
    | Test Visitor3 | 5     |
    | Test Visitor1 | 5     |
