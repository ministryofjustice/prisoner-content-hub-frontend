Feature: My Prison Page

  As a prisoner
  I want to access the My Prison section
  So that I can view content specific to my prison

  Scenario: Navigate to My Prison page directly
    Given I am on the Prisoner Content Hub
    Then I should see the My Prison page heading

  Scenario: Navigate to My Prison via navigation link
    Given I am on the Prisoner Content Hub home page
    Then I should be on the My Prison page
    And the URL should contain "/tags/1283"

  Scenario: View content cards on My Prison page
    Given I am on the My Prison page
    When the page loads
    Then I should see content cards displayed
    And there should be at least one content card visible

  Scenario: Search for content on My Prison page
    Given I am on the My Prison page
    When I search for "health"
    Then I should see search results
    And content cards should be visible

  Scenario: Click on a content card
    Given I am on the My Prison page
    And content cards are loaded
    When I click on the first content card
    Then I should navigate to the content detail page
