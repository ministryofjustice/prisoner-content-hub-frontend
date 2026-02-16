Feature: Cardiff Welsh Translations - All Pages

  Background:
    Given I am on the Cardiff prisoner content hub
    And Welsh language support is enabled with "lng=cy" parameter

  Scenario: Homepage displays all content in Welsh
    Given I am on the homepage
    When I switch to Welsh language
    Then the page heading should be in Welsh
    And the page content should display Welsh text
    And all UI elements should be translated to Welsh

  Scenario: Topics page displays all content in Welsh
    Given I navigate to the topics page
    When I switch to Welsh language
    Then the Topics heading should display in Welsh
    And the topic content should be in Welsh
    And navigation links should be in Welsh

  Scenario: Search page displays all content in Welsh
    Given I navigate to the search page
    When I switch to Welsh language
    Then the search interface should display in Welsh
    And search results should show Welsh content
    And search label should say "Chwilio'r Hyb Cynnwys"

  Scenario: Recently Added page displays all content in Welsh
    Given I navigate to the recently added content page
    When I switch to Welsh language
    Then the page title should display "Ychwanegwyd yn ddiweddar"
    And the content summary should be in Welsh
    And all content cards should have Welsh labels

  Scenario: Language persists across page navigation
    Given I am on the homepage in Welsh
    When I navigate to another page
    Then the language should remain Welsh
    And the content should continue displaying in Welsh
    And the URL should maintain the "lng=cy" parameter

  Scenario: Direct URL access with lng=cy parameter loads Welsh
    When I directly access the URL with "?lng=cy" parameter
    Then the page should load in Welsh language
    And all content should display in Welsh
    And the language selector should show English as available option

  Scenario: Invalid language parameter defaults to English
    When I access the page with an invalid language parameter "?lng=invalid"
    Then the page should default to English language
    And English content should be displayed
    And the Cymraeg button should still be available

  Scenario: Switching between Welsh and English languages
    Given I am on the homepage in Welsh
    When I click the English language link
    Then the page should switch to English
    And all content should display in English
    When I click the Cymraeg button again
    Then the page should switch back to Welsh
    And all content should display in Welsh again

  Scenario: Welsh language available on all main pages
    Given I visit each main page (topics, search, recently-added, help)
    When I view the language options
    Then the Cymraeg button should be available on all pages
    And I should be able to switch to Welsh on each page

  Scenario: Language parameter applies to all page sections
    When I access a page with "?lng=cy" parameter
    Then the header should be in Welsh
    And the navigation should be in Welsh
    And the main content should be in Welsh
    And the footer should be in Welsh
