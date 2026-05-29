Feature: Accessibility Survey & Profile Personalization
  As a user completing my setup
  I want to specify my mobility profile and barriers to avoid
  So that my routes and alerts are personalized to my needs

  Scenario: Select mobility mode and barriers to avoid
    Given the user is on the profile customization page ("/encuesta")
    When the user selects "Silla manual" as how they move
    And the user selects "Escaleras" and "Banquetas rotas" as items to avoid
    And the user clicks the "Personalizar mi mapa" button
    Then the user's choices are persisted in localStorage under "aa.profile"
    And "aa.onboarded" is set to "1" in localStorage
    And the user is redirected to the home map page ("/")
