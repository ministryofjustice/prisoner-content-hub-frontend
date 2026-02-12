Feature: Cardiff Welsh Translations - Accessibility Testing

  Background:
    Given I am on the Cardiff prisoner content hub
    And I am testing for WCAG 2.0/2.1 accessibility compliance

  Scenario: Homepage in Welsh passes WCAG accessibility checks
    Given I am on the homepage in Welsh
    When I run automated accessibility checks
    Then the page should scan successfully
    And accessibility results should be defined

  Scenario: ARIA labels present on language buttons
    Given I view the language selector
    When I check the Cymraeg button
    Then the button should have proper ARIA attributes
    And the button should be properly labeled for screen readers
    And keyboard navigation should work

  Scenario: Language switching via keyboard navigation works
    Given I am on the homepage
    When I navigate to the Cymraeg link using Tab key
    And I press Enter on the focused link
    Then the page should load in Welsh
    And all Welsh content should be displayed

  Scenario: Feedback heading has proper ARIA attributes
    Given I am on a content page in Welsh
    When I check the feedback widget heading
    Then the heading should have proper semantic HTML structure
    And screen readers should properly identify it as a heading
    And the heading level should be appropriate

  Scenario: Topics page in Welsh passes accessibility checks
    Given I navigate to the topics page in Welsh
    When I run accessibility scans
    Then the page should scan successfully
    And results should indicate proper accessibility compliance

  Scenario: Search page in Welsh passes accessibility checks
    Given I navigate to the search page in Welsh
    When I run accessibility scans
    Then the page should scan successfully
    And all form elements should be properly labeled

  Scenario: Content page with feedback in Welsh passes accessibility checks
    Given I navigate to a content page in Welsh
    And the feedback widget is visible
    When I run accessibility scans
    Then the page should scan successfully
    And all feedback form elements should be accessible

  Scenario: Feedback form has proper keyboard navigation
    Given I am on a content page with feedback in Welsh
    When I navigate the form using Tab key
    Then I should be able to reach all form elements
    And all interactive elements should be keyboard accessible
    And focus indicators should be visible

  Scenario: Language buttons have sufficient color contrast
    Given I view the language selector area
    When I check color contrast ratios
    Then the Cymraeg button should meet WCAG contrast requirements
    And all text should be readable for users with color blindness

  Scenario: Page headings maintain proper hierarchy in Welsh
    Given I am on any page in Welsh
    When I check the heading structure
    Then heading hierarchy should be proper (h1, h2, h3...)
    And no heading levels should be skipped
    And main content should start with h1

  Scenario: Focus management works for keyboard users
    Given I am on the homepage in Welsh
    When I navigate using keyboard
    Then focus should move logically through all interactive elements
    And focus should be visible on every element
    And focus should not be trapped anywhere

  Scenario: All heading levels are properly structured
    Given I am on a content page in Welsh
    When I inspect the heading structure
    Then main page heading should be h1
    And section headings should use appropriate levels
    And heading text should be descriptive and meaningful

  Scenario: Language switching maintains accessibility
    Given I am on a page with full accessibility compliance
    When I switch between Welsh and English
    Then accessibility should be maintained in both languages
    And ARIA labels should be available in both languages
    And keyboard navigation should work in both languages
