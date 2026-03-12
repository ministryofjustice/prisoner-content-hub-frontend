Feature: Cardiff Welsh Language Translations - Cymraeg Button

  Background:
    Given I am on the Cardiff prisoner content hub
    And the Cymraeg button is configured for Welsh language switching

  Scenario: Cymraeg button is visible and properly configured
    When I view the homepage
    Then the Cymraeg language button should be visible
    And the button should contain the text "Cymraeg"
    And the button should have the correct href parameter "?lng=cy"

  Scenario: Clicking Cymraeg button navigates to Welsh version
    When I am on the homepage
    And I click the Cymraeg button
    Then the page should load the Welsh language version
    And the URL should contain the "lng=cy" parameter
    And page content should be displayed in Welsh

  Scenario: Cymraeg link attributes match expected accessibility standards
    When I view the page
    And I locate the Cymraeg language link
    Then the link should have a valid href attribute
    And the link should have proper ARIA attributes for screen readers
    And the link should have a non-empty text content

  Scenario: Cymraeg link is only available on Cardiff prison
    Given I am on the Cardiff prison site
    When I view the language options
    Then the Cymraeg button should be visible
    And the button should be functional

  Scenario: Cymraeg button has proper visual contrast and styling
    When I view the language selector area
    Then the Cymraeg button should have sufficient color contrast
    And the button should be properly styled
    And the button should be keyboard accessible
