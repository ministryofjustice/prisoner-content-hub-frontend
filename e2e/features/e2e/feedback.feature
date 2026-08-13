Feature: Feedback Buttons - Functional Behavior

  # Core Feedback Button Rendering Tests
  Scenario: Feedback widget is present on content pages
    Given I am on a content page with feedback widget
    When the page finishes loading
    Then the feedback widget should be visible
    And the like button should be present
    And the dislike button should be present

  Scenario: Feedback buttons have correct attributes
    Given I am on a content page with feedback widget
    When I inspect the feedback buttons
    Then the like button should have aria-label "like"
    And the like button should have value "LIKE"
    And the dislike button should have aria-label "dislike"
    And the dislike button should have value "DISLIKE"

  Scenario: Feedback buttons have correct CSS classes
    Given I am on a content page with feedback widget
    When I inspect the feedback buttons
    Then the like button should have class "govuk-hub-thumbs--up"
    And the dislike button should have class "govuk-hub-thumbs--down"
    And both buttons should have class "govuk-link"
    And both buttons should have class "govuk-hub-thumbs"

  # Interaction Tests
  Scenario: Clicking like button shows feedback form
    Given I am on a content page with feedback widget
    When I click the like button
    Then the like button should have class "is-selected"
    And the feedback form should become visible
    And the feedback text should display "I like this"

  Scenario: Clicking dislike button shows feedback form
    Given I am on a content page with feedback widget
    When I click the dislike button
    Then the dislike button should have class "is-selected"
    And the feedback form should become visible
    And the feedback text should display "I don't like this"

  Scenario: Switching between like and dislike
    Given I am on a content page with feedback widget
    When I click the like button
    And I wait for the feedback form to appear
    And I click the dislike button
    Then the dislike button should have class "is-selected"
    And the like button should not have class "is-selected"

  # Feedback Form Tests
  Scenario: Like feedback form shows correct options
    Given I am on a content page with feedback widget
    When I click the like button
    Then the feedback form should show like options
    And the dislike options should be hidden

  Scenario: Dislike feedback form shows correct options
    Given I am on a content page with feedback widget
    When I click the dislike button
    Then the feedback form should show dislike options
    And the like options should be hidden

  Scenario: Submitting feedback shows confirmation
    Given I am on a content page with feedback widget
    When I click the like button
    And I select a feedback option
    And I submit the feedback form
    Then the feedback confirmation should be visible
    And the confirmation should say "Thanks for your feedback"

  Scenario: Feedback buttons are disabled after submission
    Given I am on a content page with feedback widget
    When I click the like button
    And I select a feedback option
    And I submit the feedback form
    Then the feedback buttons should be disabled
    And the submit button should be disabled

  # Additional Info Display Tests
  Scenario: More info section displays after clicking feedback button
    Given I am on a content page with feedback widget
    When I click the like button
    Then the more info section should become visible
    And the more info section should contain contact information

  # Accessibility Tests
  Scenario: Feedback buttons are keyboard accessible
    Given I am on a content page with feedback widget
    When I navigate to the like button using keyboard
    And I press Enter on the like button
    Then the feedback form should become visible

  Scenario: Feedback form is keyboard accessible
    Given I am on a content page with feedback widget
    When I click the like button
    And I navigate through the feedback form using keyboard
    Then all form elements should be focusable
    And I can submit the form using keyboard
