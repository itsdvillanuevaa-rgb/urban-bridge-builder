Feature: User Profile and Community Impact
  As an active contributor
  I want to view my profile details, badges, and past reports
  So that I can track my community impact

  Scenario: View profile and impact statistics
    Given the user is on the profile tab page ("/perfil")
    Then they see their avatar initials, name "Elena Jiménez", level 12, and an XP progress bar
    And they see impact metrics: "Reportes: 184", "Rutas: 42", and "Personas: 1.2k"
    And a list of earned badges (e.g. "Medalla vial", "Auditora")
    And a scrollable history list of their past reports showing their status ("activo", "verificado", "resuelto")

  Scenario: Modify profile settings
    Given the user is on the profile tab page ("/perfil")
    When the user clicks the "Ajustes" gear button in the top right corner
    Then the user is redirected to the customization page ("/encuesta") to edit their preferences
 