# Route Search & Navigation Skill

## Objective

Implement the Route Planning module for an accessibility application.

The implementation must complete the following scenarios:

1. Autocomplete search query for locations using OpenStreetMap Nominatim.
2. Select destination and display suggested route options.
3. Manage search history.

Do not generate mock implementations if a real solution can be implemented.

---

## Requirements

### Scenario 1: Location Autocomplete

Implement a search input that retrieves location suggestions from OpenStreetMap Nominatim.

Requirements:

- Use the Nominatim Search API.
- Trigger requests only after 3 characters.
- Debounce requests by 300ms.
- Limit results to 5 suggestions.
- Display loading state.
- Handle API failures gracefully.
- Show empty state when no results are found.

Expected API example:

GET https://nominatim.openstreetmap.org/search?q={query}&format=jsonv2&limit=5

Deliverables:

- Search component.
- API service layer.
- Type definitions.
- Error handling.
- Loading state.

Acceptance Criteria:

- Typing "Tijuana" shows location suggestions.
- Clicking a suggestion selects the destination.
- No duplicate requests are generated during rapid typing.

---

### Scenario 2: Destination Selection and Route Suggestions

After selecting a destination:

- Store destination in component state.
- Display route suggestions panel.

Generate at least 3 route options:

- Fastest Route
- Most Accessible Route
- Alternative Route

Each route card must include:

- Estimated distance.
- Estimated duration.
- Accessibility score.
- Warnings about obstacles if available.

If a routing backend is not implemented:

- Create a RouteRecommendationService abstraction.
- Create mock provider implementation.
- Document integration points for future OSRM/OpenRouteService integration.

Acceptance Criteria:

- Selecting a location immediately displays route options.
- Route cards render correctly.
- Architecture allows replacing mock data with real routing APIs.

---

### Scenario 3: Search History

Implement persistent search history.

Requirements:

- Save destination searches.
- Persist data locally.
- Maximum 10 records.
- Most recent first.
- Remove duplicates.
- Allow clearing history.

Storage:

- AsyncStorage (React Native)
- localStorage (Web)

Functions required:

- saveSearch()
- getSearchHistory()
- removeDuplicateSearch()
- clearSearchHistory()

Acceptance Criteria:

- Previous searches appear when reopening the screen.
- Selecting a history item repeats the search.
- History survives application restart.

---

## Architecture Requirements

Create:

services/
nominatimService.ts
routeRecommendationService.ts
searchHistoryService.ts

components/
SearchBar.tsx
SearchSuggestions.tsx
RouteCard.tsx
RouteOptionsPanel.tsx

hooks/
useLocationSearch.ts
useSearchHistory.ts

types/
location.ts
route.ts

---

## Code Quality Rules

- Use TypeScript strict mode.
- Avoid duplicated logic.
- Separate UI from business logic.
- Use reusable hooks.
- Include error handling.
- Include loading states.
- Include empty states.
- Add comments only when necessary.

---

## Output Requirements

Generate:

1. Complete implementation.
2. All required services.
3. Hooks.
4. Components.
5. Type definitions.
6. Integration instructions.
7. Any required dependency installation commands.

Do not stop after generating a plan.

Implement the code directly.
