Feature: Privacy Policy Footer Link - Functional Behavior

  # Core Link Rendering Tests
  Scenario: Privacy link is present in footer
    Given I am on the homepage
    When I scroll to the footer
    Then the privacy link should be visible
    And the privacy link should have text "Privacy"

  Scenario: Privacy link has valid href
    Given I am on the homepage
    When I inspect the privacy link
    Then the privacy link should have a valid href attribute
    And the href should point to "/content/4856"

  # Navigation Tests
  Scenario: Privacy link navigation works
    Given I am on the homepage
    And the privacy link is present in the footer
    When I click the privacy link
    Then the URL should change
    And I should navigate to the privacy page
    And the privacy page should load successfully
