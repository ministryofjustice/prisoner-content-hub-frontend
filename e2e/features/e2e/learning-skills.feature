Feature: Learning and Skills Page - Functional Behavior

  # Core Navigation Tests
  Scenario: Page loads successfully via direct URL
    Given I navigate to /tags/1341
    When the page finishes loading
    Then the page heading should be visible
    And the page structure should render correctly

  Scenario: Page loads successfully via navigation link
    Given I am on the Prisoner Content Hub home page
    When I click the navigation link for /tags/1341
    Then the URL should update to /tags/1341
    And the page heading should be visible

  Scenario: Page renders content structure
    Given I am on /tags/1341
    When the page loads
    Then the page should render without errors
    And the content area should be present

  # Series Tiles Functional Tests
  Scenario: Series tiles section renders
    Given I am on /tags/1341
    When the page loads
    Then the series tiles section should be queryable
    And the tile count should be retrievable

  Scenario: Series tiles display correctly when present
    Given I am on /tags/1341
    And series tiles are present on the page
    When I inspect a tile
    Then it should have a title element
    And it should have an image element

  Scenario: Series tile navigation works when clicked
    Given I am on /tags/1341
    And at least one series tile is present
    When I click on a series tile
    Then the URL should change from /tags/1341

