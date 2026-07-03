# Premium Full-Stack URL Shortener

A high-performance, secure, and modern URL shortening platform built with a **React** frontend and a **Spring Boot** backend, using **PostgreSQL** for persistence and **JWT** for authentication.

---

## 🚀 Key Features

* **Instant URL Shortening**: Paste any long URL and instantly receive a clean, 8-character shortened slug.
* **Interactive Analytics Dashboard**: View total clicks, trends, and click logs represented via rich interactive charts.
* **Secure Access**: JWT-token based user registration and login, ensuring private link management and analytics.
* **Auto-Redirection & Logging**: Instant redirection of shortened URLs to their original destinations while tracking click analytics asynchronously.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React 18, Vite
* **Styling**: TailwindCSS, Material UI (MUI)
* **Routing**: React Router DOM
* **Charts**: Chart.js & React-Chartjs-2
* **Animations**: Framer Motion

### Backend
* **Core**: Java 21, Spring Boot 3.4.0
* **Security**: Spring Security & JJWT (JSON Web Tokens)
* **Database**: Spring Data JPA & PostgreSQL
* **Utilities**: Lombok, Maven

---

## ⚙️ Setup and Installation

### 1. Database Configuration
Create a PostgreSQL database named `url_shortener_db` and make sure it's active.

### 2. Run the Backend (`url-shortener-sb`)
1. Navigate to the backend folder:
   ```bash
   cd url-shortener-sb
   ```
2. Configure your database credentials in [application.properties](url-shortener-sb/src/main/resources/application.properties):
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/url_shortener_db
   spring.datasource.username=your_postgres_username
   spring.datasource.password=your_postgres_password
   ```
3. Run the application:
   ```bash
   .\mvnw spring-boot:run
   ```

### 3. Run the Frontend (`url-shortener-react`)
1. Navigate to the frontend folder:
   ```bash
   cd url-shortener-react
   ```
2. Configure `.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:8080
   VITE_REACT_FRONT_END_URL=http://localhost:5173
   ```
3. Install dependencies and start the app:
   ```bash
   npm install
   npm run dev
   ```

---

## 📂 Project Directory Structure

```text
├── url-shortener-react/      # React & Vite Frontend
│   ├── src/
│   │   ├── components/      # UI components & pages
│   │   ├── contextApi/      # React state context
│   │   └── api/             # API request wrappers
│   └── package.json
│
└── url-shortener-sb/         # Spring Boot Backend
    ├── src/main/java/com/url/shortener/
    │   ├── controller/      # API endpoints
    │   ├── service/         # Business logic
    │   ├── repository/      # JPA database operations
    │   └── security/        # JWT & Spring Security configs
    └── pom.xml
```
