Feature: Browse All Topics Footer - Functional Behavior

  # Core Footer Rendering Tests
  Scenario: Footer section renders on homepage
    Given I am on the homepage
    When the page finishes loading
    Then the footer section should be visible
    And the "Browse all topics" heading should be present

  Scenario: Footer links are rendered
    Given I am on the homepage
    When I scroll to the footer
    Then footer links should be present
    And footer links should be queryable

  Scenario: Footer contains valid topic links
    Given I am on the homepage
    When I inspect footer links
    Then all links should have valid href attributes
    And some links should point to tag pages

  # Navigation Tests
  Scenario: All footer tag links are navigable
    Given I am on the homepage
    And footer links are present
    When I test all footer tag links
    Then footer should have tag links
    And all tag links should navigate successfully
    And each tag link should change the URL
    And each tag link should navigate to a tag page

  # Example tag links that may be present in the footer
  # (Actual tags are CMS-controlled and may vary by prison)
  Examples of footer tag links:
    | Tag Name                                        | Expected Path Pattern |
    | Appeals                                         | /tags/819             |
    | Art                                             | /tags/1444            |
    | Black stories and culture                       | /tags/746             |
    | Bullying                                        | /tags/1719            |
    | Business Hub                                    | /tags/1498            |
    | CFO3                                            | /tags/1713            |
    | Communication                                   | /tags/745             |
    | Complaints                                      | /tags/815             |
    | Covid                                           | /tags/894             |
    | Crash Course                                    | /tags/1640            |
    | Cymraeg                                         | /tags/885             |
    | Equality                                        | /tags/747             |
    | Family                                          | /tags/732             |
    | Forward Trust                                   | /tags/1702            |
    | GCF LearnFree                                   | /tags/1705            |
    | Getting out                                     | /tags/1448            |
    | Gypsy, Roma and Traveller History Month on NPR | /tags/2037            |
    | History                                         | /tags/1312            |
    | Home Detention Curfew (HDC)                     | /tags/1643            |
    | Imprisonment for Public Protection (IPP)        | /tags/846             |
    | Incentives (IEP)                                | /tags/1417            |
    | LGBTQ+                                          | /tags/731             |
    | Learning Difficulties and Disabilities (LDD)    | /tags/1688            |
    | Legal advice                                    | /tags/1774            |
    | Lifers                                          | /tags/845             |
    | Milton Keynes College                           | /tags/1699            |
    | Mindfulness                                     | /tags/740             |
    | Modern Slavery                                  | /tags/1779            |
    | Music                                           | /tags/1505            |
    | National Literacy Trust                         | /tags/1697            |
    | National Prison Radio - Black History Month     | /tags/1908            |
    | National Prison Radio - Safety Week             | /tags/2133            |
    | Novus Cambria (Education)                       | /tags/1691            |
    | Poetry                                          | /tags/825             |
    | Positivity                                      | /tags/754             |
    | Prison Advice and Care Trust (PACT)             | /tags/1665            |
    | Prison Radio (NPR)                              | /tags/1834            |
    | Prison reform                                   | /tags/734             |
    | Prisoner rights                                 | /tags/738             |
    | Problem Solving Week on NPR                     | /tags/2256            |
    | Recall                                          | /tags/820             |
    | Recovery                                        | /tags/735             |
    | Restorative justice                             | /tags/781             |
    | Self-harm                                       | /tags/856             |
    | Self-help                                       | /tags/741             |
    | Success stories                                 | /tags/724             |
    | The Prison Phoenix Trust                        | /tags/1648            |
    | Visits                                          | /tags/1133            |
    | Wellbeing                                       | /tags/743             |
    | Who employs people with a criminal record?      | /tags/1422            |
