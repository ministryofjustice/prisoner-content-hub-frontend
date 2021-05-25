Feature: Home Page

  As a user in HMP Wayland
  I want to use the Prisoner Content Hub for my prison
  So that I can see content relevant to me

  Scenario: I go to the Berwyn home page
    Given that I go to the Prisoner Content Hub for "Berwyn"
    Then I see the "Berwyn" home page

  Scenario: I go to the Wayland home page
    Given that I go to the Prisoner Content Hub for "Wayland"
    Then I see the "Wayland" home page
    And I am displayed the "Sign in" link

  Scenario: I go to the Cookham Wood home page
    Given that I go to the Prisoner Content Hub for "Cookham Wood"
    Then I see the "Cookham Wood" home page
