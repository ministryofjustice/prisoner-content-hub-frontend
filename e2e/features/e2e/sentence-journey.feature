Feature: Sentence Journey Page

  As a prisoner
  I want to access the Sentence Journey section
  So that I can view content related to my sentence journey

  Scenario: Navigate to Sentence Journey page directly
    Given I am on the Prisoner Content Hub
    When I navigate to the Sentence Journey page
    Then I should see the Sentence Journey page heading
    And content should be loaded on the page

  Scenario: Navigate to Sentence Journey via navigation link
    Given I am on the Prisoner Content Hub home page
    When I click on the "Sentence Journey" navigation link
    Then I should be on the Sentence Journey page
    And the URL should contain "/tags/1285"

  Scenario: View content cards on Sentence Journey page
    Given I am on the Sentence Journey page
    When the page loads
    Then I should see content cards displayed
    And there should be at least one content card visible

  Scenario: Search for content on Sentence Journey page
    Given I am on the Sentence Journey page
    When I search for "parole"
    Then I should see search results
    And content cards should be visible

  Scenario: Click on a content card
    Given I am on the Sentence Journey page
    And content cards are loaded
    When I click on the first content card
    Then I should navigate to the content detail page

  Scenario: View "In this section" series tiles
    Given I am on the Sentence Journey page
    Then I should see the "In this section" heading
    And I should see multiple series tiles

  Scenario: Verify series tiles have required elements
    Given I am on the Sentence Journey page
    When I check the first series tile
    Then it should have a title
    And it should have an image
    And it should have a valid link

  Scenario: Navigate to a series tile
    Given I am on the Sentence Journey page
    And I can see series tiles in the section
    When I click on a series tile
    Then I should navigate to that tile's page
    And the URL should match the tile's link

  Scenario: Navigate through multiple series tiles
    Given I am on the Sentence Journey page
    When I visit multiple series tiles sequentially
    Then I should successfully navigate to each tile's page
    And each page should load correctly

  Scenario: Verify series tags on tiles
    Given I am on the Sentence Journey page
    When I check the series tiles
    Then some tiles may have a "SERIES" tag
    And the tag should be clearly visible
