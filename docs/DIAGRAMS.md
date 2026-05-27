# Diagrams

## Architecture

~~~mermaid
flowchart LR
  User["Role-aware user"] --> UI["React dashboard"]
  UI --> API["Express API"]
  API --> RBAC["RBAC middleware"]
  API --> VALID["Zod validation"]
  API --> ENGINE["Friction Decision engine"]
  API --> DB[("Synthetic JSON database")]
  ENGINE --> EXPLAIN["Reason codes and explanation"]
  EXPLAIN --> UI
  classDef ui fill:#ecfeff,stroke:#0891b2,color:#083344
  classDef api fill:#fff7ed,stroke:#f97316,color:#431407
  classDef sec fill:#fee2e2,stroke:#dc2626,color:#450a0a
  classDef data fill:#ecfdf5,stroke:#059669,color:#052e16
  class UI ui
  class API,ENGINE,EXPLAIN api
  class RBAC,VALID sec
  class DB data
~~~

## DFD

~~~mermaid
flowchart TD
  A["Synthetic form input"] --> B["Validation"]
  B --> C{"RBAC allowed?"}
  C -- No --> D["403 RBAC_DENIED"]
  C -- Yes --> E["Route handler"]
  E --> F[("JSON DB")]
  E --> G["Decision engine"]
  G --> H["Explanation"]
  F --> I["Dashboard response"]
  H --> I
~~~

## Deployment

~~~mermaid
flowchart LR
  Dev["Developer workstation"] --> Git["Private GitHub repo"]
  Git --> CI["Build/test/audit"]
  CI --> Runtime["Node runtime"]
  Runtime --> Backend["Backend :4106"]
  Runtime --> Frontend["Frontend :5106"]
  Backend --> Store[("Mounted JSON DB")]
~~~

## Integration Flow

~~~mermaid
sequenceDiagram
  participant User as Dashboard User
  participant UI as React UI
  participant API as Express API
  participant RBAC as RBAC
  participant Engine as Decision Engine
  participant DB as JSON DB
  User->>UI: Submit simulator or CRUD action
  UI->>API: Request with x-user-role
  API->>RBAC: Check permission
  RBAC-->>API: Allow or deny
  API->>DB: Read or write synthetic record
  API->>Engine: Compute decision
  Engine-->>API: Reason codes and explanation
  API-->>UI: JSON response
~~~

## API Flow

~~~mermaid
flowchart LR
  Health["GET /api/health"] --> Roles["roles and service"]
  Metrics["GET /api/metrics"] --> KPI["KPIs"]
  Crud["CRUD endpoints"] --> Records["records"]
  Domain["POST /api/brake-decisions"] --> Decision["decision"]
~~~

## RBAC

~~~mermaid
flowchart TD
  Role["Selected role"] --> Read["read"]
  Role --> Write{"write?"}
  Role --> Admin{"admin?"}
  Write --> Create["create and patch"]
  Admin --> Delete["delete"]
~~~

