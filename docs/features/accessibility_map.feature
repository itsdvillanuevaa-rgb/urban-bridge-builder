Feature: Accessibility Map & Dashboard
  As an active user
  I want an interactive map dashboard
  So that I can see nearby alerts and look up routes immediately

  Scenario: Render home dashboard elements
    Given the user has completed onboarding and is on the homepage ("/")
    Then the user sees the full-screen interactive Leaflet map
    And a top search bar asking "¿A dónde vamos?"
    And quick filter buttons for "Rampas", "Sin escaleras", "Baños", and "Descanso"
    And a floating locate button ("Centrar en mi ubicación")
    And a bottom summary card showing the number of active alerts in the area

  Scenario: Interact with the bottom sheet alert preview
    Given the user is on the homepage ("/")
    Then they see a peek preview of up to 2 active alerts
    When the user clicks "Ver todas"
    Then the user is redirected to "/alertas"
    When the user clicks "Buscar ruta accesible"
    Then the user is redirected to "/rutas"
