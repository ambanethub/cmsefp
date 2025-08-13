# Contraband Management System (CMS)

A fully functional CMS composed of a Next.js frontend and Java Spring Boot microservices, orchestrated behind a Spring Cloud Gateway.

## Structure

- `cms-dashboard/`: Next.js 14 app (App Router) – the provided frontend UI
- `backend/`
  - `cms-gateway` (port 8080): Spring Cloud Gateway (CORS enabled)
  - `cms-auth` (port 8081): Auth service (login, session check)
  - `cms-seizures` (port 8082): Seizure records (list, get, create)
  - `cms-inventory` (port 8083): Locations and inventory items
  - `cms-transfers` (port 8084): Custody transfers (list, get, create)
  - `cms-audit` (port 8085): Audit logs and reports metadata

All services use Java 21 and Maven. Data is in-memory for demo and easy extension to a database.

## Prerequisites

- Java 21 (OpenJDK 21)
- Maven 3.9+
- Node.js 18+ and one of: pnpm (recommended), npm, or yarn

## Quick Start

1) Build services

```bash
cd backend
for m in cms-auth cms-seizures cms-inventory cms-transfers cms-audit cms-gateway; do 
  (cd $m && mvn -DskipTests package)
done
```

2) Run services (in separate terminals) or background them

```bash
# Suggested order: gateway last
java -jar backend/cms-auth/target/cms-auth-0.0.1-SNAPSHOT.jar &
java -jar backend/cms-seizures/target/cms-seizures-0.0.1-SNAPSHOT.jar &
java -jar backend/cms-inventory/target/cms-inventory-0.0.1-SNAPSHOT.jar &
java -jar backend/cms-transfers/target/cms-transfers-0.0.1-SNAPSHOT.jar &
java -jar backend/cms-audit/target/cms-audit-0.0.1-SNAPSHOT.jar &
java -jar backend/cms-gateway/target/cms-gateway-0.0.1-SNAPSHOT.jar &
```

- Gateway health: `http://localhost:8080/actuator/health`

3) Configure and run the frontend

```bash
cd cms-dashboard
# Configure API base (defaults to http://localhost:8080)
echo "NEXT_PUBLIC_API_BASE=http://localhost:8080" > .env.local

# Install deps and run dev (choose your manager)
pnpm i && pnpm dev
# or
npm install && npm run dev
# or
yarn install && yarn dev
```

- App: `http://localhost:3000`

## Authentication (Demo)

- POST `/auth/login` with any username/password to log in as Supervisor
- Special case: `admin / admin123` triggers MFA (code `123456`) → Admin role
- Frontend stores the returned user in `localStorage` (`cms_user`)

## Gateway Routes (default ports)

- `/auth/**` → `http://localhost:8081`
- `/seizures/**` → `http://localhost:8082`
- `/inventory/**` → `http://localhost:8083`
- `/transfers/**` → `http://localhost:8084`
- `/audit/**`, `/reports/**` → `http://localhost:8085`

CORS is enabled on the gateway for local development.

## Key Endpoints

- Auth
  - `POST /auth/login` → `{ username, role, name, authenticated, token }`
  - `GET /auth/me`
- Seizures
  - `GET /seizures`
  - `GET /seizures/{id}`
  - `POST /seizures` (accepts the registration payload from the UI)
- Inventory
  - `GET /inventory/locations`
  - `GET /inventory/items`
  - `GET /inventory/locations/{id}`
- Transfers
  - `GET /transfers`
  - `GET /transfers/{id}`
  - `POST /transfers`
- Audit/Reports
  - `GET /audit/logs`
  - `GET /reports/templates`

## Environment

- Frontend base URL: `NEXT_PUBLIC_API_BASE` (defaults to `http://localhost:8080`)
- Services’ ports configurable via each service `application.yml`

## Notes

- Services use in-memory stores for demo. Swap with a database (JPA/JDBC) as needed.
- UI remains identical to the provided design; data is now served from the microservices.