Feature: Category pages

  As a user of the Prisoner Content Hub
  I want to be able to browse content in a category
  So that I can I can find related content

  Scenario: I navigate to the category page
    Given that I go to the Prisoner Content Hub for "Wayland"
    When I click the "Music & talk" link
    Then I am taken to the "Music and talk" page
