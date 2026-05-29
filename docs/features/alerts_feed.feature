Feature: Accessibility Alerts Feed
  As a citizen navigating the city
  I want to view nearby accessibility alerts filtered by severity
  So that I can plan around obstacles or locate accessible amenities

  Scenario: View all alerts sorted and filter by severity
    Given the user is on the alerts feed page ("/alertas")
    Then they see the total number of active alerts in the area
    And a list of all active alerts showing details: title, location, category icon, and status
    When the user clicks the "Alta" filter tab
    Then the feed is filtered to show only alerts with high severity
