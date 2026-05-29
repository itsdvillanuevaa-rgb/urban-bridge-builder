Feature: Route Planning & Accessibility Suggestions
  As a user planning a journey
  I want to search for origin and destination locations
  So that I can receive custom accessible route alternatives

  Scenario: Autocomplete search query for locations using OpenStreetMap Nominatim
    Given the user is on the route search page ("/rutas")
    When the user types "Juárez" in the destination field
    Then the app triggers a debounced request to the Nominatim API
    And lists matching address results in a dropdown list

  Scenario: Select destination and display suggested route options
    Given the user is on the route search page ("/rutas")
    When the user selects a location from the search results list
    Then the dropdown list closes
    And the selected location is populated in the destination input field
    And the location is saved to the user's search history in localStorage
    And the app displays a list of suggested route options with:
      | Route Title                | Accessibility Score | Duration (min) | Incline Severity | Ramps Count |
      | Ruta accesible recomendada | 96                  | 22             | suave            | 8           |
      | Ruta alternativa más corta | 74                  | 18             | moderada         | 5           |

  Scenario: Manage search history
    Given the user focus on a search field in "/rutas"
    Then the user sees recent searches history populated from localStorage
    When the user clicks the "X" button next to a history item
    Then the item is removed from the list and from localStorage
