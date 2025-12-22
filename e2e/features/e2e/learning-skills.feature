Feature: Learning and Skills Page

  Scenario: Navigate to Learning and Skills page directly
    Given I am on the Prisoner Content Hub
    When I navigate to the Learning and Skills page
    Then I should see the Learning and Skills page heading
    And content should be loaded on the page

  Scenario: Navigate to Learning and Skills via navigation link
    Given I am on the Prisoner Content Hub home page
    When I click on the "Learning and skills" navigation link
    Then I should be on the Learning and Skills page
    And the URL should contain "/tags/1341"

  Scenario: View content cards on Learning and Skills page
    Given I am on the Learning and Skills page
    When the page loads
    Then I should see content cards displayed
    And there should be at least one content card visible

  Scenario: Search for content on Learning and Skills page
    Given I am on the Learning and Skills page
    When I search for "education"
    Then I should see search results
    And content cards should be visible

  Scenario: Click on a content card
    Given I am on the Learning and Skills page
    And content cards are loaded
    When I click on the first content card
    Then I should navigate to the content detail page

  # Series Tiles Scenarios
  Scenario: View "In this section" series tiles
    Given I am on the Learning and Skills page
    Then I should see the "In this section" heading
    And I should see multiple series tiles

  Scenario: Verify series tiles have required elements
    Given I am on the Learning and Skills page
    When I check the first series tile
    Then it should have a title
    And it should have an image
    And it should have a valid href

  Scenario: Navigate to a series tile
    Given I am on the Learning and Skills page
    When I click on a series tile
    Then I should navigate to that series page

  Scenario: Verify series tags are present
    Given I am on the Learning and Skills page
    When I check series tiles
    Then some tiles should have SERIES tags
    And SERIES tags should be styled correctly

  Scenario: View all series tile titles
    Given I am on the Learning and Skills page
    When I retrieve all series tile titles
    Then all titles should be non-empty strings

  # Error Handling Scenarios
  Scenario: Handle page load failure gracefully
    Given I am on the Prisoner Content Hub
    When I navigate to the Learning and Skills page
    And the page fails to load completely
    Then I should see an appropriate error message or fallback content
    And the page should not crash

  Scenario: Handle missing content gracefully
    Given I am on the Learning and Skills page
    When no content is available
    Then I should see a "no content" message
    And the page layout should remain intact

  Scenario: Handle invalid search query
    Given I am on the Learning and Skills page
    When I search for special characters or invalid input
    Then the search should handle the input safely
    And I should not see any error messages
    And the page should remain functional

  Scenario: Handle search with no results
    Given I am on the Learning and Skills page
    When I search for content that doesn't exist
    Then I should see a "no results found" message
    And I should have the option to clear my search

  Scenario: Handle broken content card link
    Given I am on the Learning and Skills page
    And content cards are loaded
    When I click on a content card with a broken link
    Then I should see an appropriate error page or message
    And I should be able to navigate back

  Scenario: Handle navigation failure
    Given I am on the Prisoner Content Hub home page
    When I click on the "Learning and skills" navigation link
    And the navigation fails
    Then I should remain on the current page or see an error message
    And the page should not become unresponsive

  Scenario: Handle slow content loading
    Given I am on the Learning and Skills page
    When content takes longer than expected to load
    Then I should see a loading indicator
    And the page should eventually display content or timeout gracefully

  Scenario: Handle concurrent user actions
    Given I am on the Learning and Skills page
    When I click multiple content cards rapidly
    Then the page should handle concurrent navigation requests
    And only navigate to the last clicked item
    And no JavaScript errors should occur

  Scenario: Handle browser back button after error
    Given I am on the Learning and Skills page
    And I navigate to a content detail page that errors
    When I click the browser back button
    Then I should return to the Learning and Skills page
    And the page should be fully functional

  Scenario: Handle invalid URL parameters
    Given I am on the Prisoner Content Hub
    When I navigate to the Learning and Skills page with invalid parameters
    Then the page should ignore invalid parameters
    And display the default Learning and Skills content
    And no errors should be visible

  Scenario: Handle partial content load failure
    Given I am on the Learning and Skills page
    When some content loads but other parts fail
    Then successfully loaded content should be displayed
    And failed sections should show error messages or be hidden
    And the page should remain interactive
