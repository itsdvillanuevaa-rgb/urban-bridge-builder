Feature: Onboarding Wizard
  As a first-time user
  I want an onboarding slideshow
  So that I can understand the core benefits of the application

  Scenario: Navigating through onboarding slides
    Given the user is on the onboarding screen ("/onboarding")
    Then the first slide is shown: "Rutas que respetan tu paso"
    When the user clicks the "Siguiente" button
    Then the second slide is shown: "Reporta barreras en segundos"
    When the user clicks the "Siguiente" button
    Then the third slide is shown: "Comunidad que valida"
    And the button text changes to "Comenzar"
    When the user clicks the "Comenzar" button
    Then the user is redirected to "/encuesta"

  Scenario: Skipping onboarding
    Given the user is on any onboarding slide
    When the user clicks the "Saltar" button
    Then the user is redirected to "/encuesta"
