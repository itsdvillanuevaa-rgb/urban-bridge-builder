Feature: Splash Screen and Initial Navigation Redirect
  As a new or returning user
  I want a splash screen to appear on launch
  So that the app can initialize and direct me to the correct view

  Scenario: Show splash screen and redirect new user to onboarding
    Given the user has not completed onboarding (no "aa.onboarded" in local storage)
    When the user opens the application
    Then the splash screen is displayed with the logo, title "Acento Accesible", and subtitle "La ciudad sin barreras."
    And after 1600 milliseconds, the user is redirected to "/onboarding"

  Scenario: Show splash screen and redirect returning user to map dashboard
    Given the user has completed onboarding ("aa.onboarded" exists in local storage)
    When the user opens the application
    Then the splash screen is displayed
    And after 1600 milliseconds, the user is redirected to "/" (homepage/map)
