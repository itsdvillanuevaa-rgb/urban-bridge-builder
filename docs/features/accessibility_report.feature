Feature: Create Accessibility Report
  As a citizen contributor
  I want to report an urban accessibility barrier
  So that I can help other community members avoid it

  Scenario: Select barrier category (Step 1)
    Given the user is on the new report page ("/reportar")
    Then the "Continuar" button is disabled
    When the user selects a barrier category: "Obstáculo"
    Then the category is highlighted
    And the "Continuar" button becomes active
    When the user clicks "Continuar"
    Then the user transitions to Step 2 (Location & Details)

  Scenario: Confirm location and upload optional photo (Step 2)
    Given the user is on Step 2 of reporting
    Then they see a map canvas with a locator pin
    And the address is previewed as "Av. Juárez 30, Centro"
    When the user clicks "Agregar foto"
    Then the button changes state to "Foto añadida"
    When the user clicks "Enviar reporte"
    Then the user transitions to Step 3 (Success)

  Scenario: Success screen and redirection (Step 3)
    Given the user has completed the report submission
    Then they see a green check success icon with title "¡Gracias!"
    And a message stating how many people this report will help
    When the user clicks "Volver al mapa"
    Then the user is redirected to the home screen ("/")
    When the user clicks "Hacer otro reporte"
    Then the wizard resets back to Step 1
