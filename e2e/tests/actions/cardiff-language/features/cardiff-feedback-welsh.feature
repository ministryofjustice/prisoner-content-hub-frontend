Feature: Cardiff Welsh Translations - Feedback Buttons

  Background:
    Given I am on the Cardiff prisoner content hub
    And the feedback widget is available on content pages

  Scenario: Feedback widget heading displays in Welsh
    Given I am on a content page
    And I switch to Welsh language
    When the feedback widget is visible
    Then the feedback heading should display in Welsh
    And the heading should say "Rhowch adborth i ni" or "Dywedwch wrthym beth ydych chi'n ei feddwl o'r dudalen hon"

  Scenario: Feedback widget heading displays in English
    Given I am on a content page in English language
    When the feedback widget is visible
    Then the feedback heading should display in English
    And the heading should say "Give us your feedback"

  Scenario: Feedback like options display in Welsh
    Given I am on a content page in Welsh
    When I view the feedback like options
    Then all like options should display in Welsh
    And option 1 should show "Rwy'n hoffi'r"
    And option 2 should show "Mi wnes i fwynhau hwn"
    And option 3 should show "Roedd hwn o fuyd i mi"
    And option 4 should show "Roedd hwn yn ddiddorol"

  Scenario: Feedback like options display in English
    Given I am on a content page in English
    When I view the feedback like options
    Then all like options should display in English
    And option 1 should show "I like this"
    And option 2 should show "I enjoyed this"

  Scenario: Feedback dislike options display in Welsh
    Given I am on a content page in Welsh
    When I view the feedback dislike options
    Then all dislike options should display in Welsh
    And option 1 should show "Dydw i ddim yn hoffi'r"
    And option 2 should show "Wnes i ddim mwynhau hwn"
    And option 3 should show "Doedd hwn ddim yn berthnasol i mi"

  Scenario: Feedback submit button displays in Welsh
    Given I am on a content page in Welsh
    When I view the feedback form
    Then the submit button should display "Anfon" (Welsh for Send)

  Scenario: Feedback submit button displays in English
    Given I am on a content page in English
    When I view the feedback form
    Then the submit button should display "Send"

  Scenario: Language switching updates feedback text
    Given I am on a content page in Welsh
    And the feedback widget is visible with Welsh text
    When I switch to English language
    Then the feedback heading should change to English
    And the feedback options should update to English
    And the submit button should change to "Send"

  Scenario: Feedback visible on directly accessed Welsh page
    When I directly access a content page with "?lng=cy" parameter
    And the page loads in Welsh
    Then the feedback widget should be visible
    And the feedback heading should display in Welsh
    And the submit button should show "Anfon"
