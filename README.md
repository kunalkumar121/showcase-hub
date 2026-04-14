# 🎬 Netflix UI Clone (IMDB API Project)

A Netflix-style web application built using **React.js** that displays movies and TV shows using the public API: https://imdbapi.dev/

---

## 🚀 Features

### ✅ Core Features

* 🎥 Fetch and display movies & TV shows from API
* 🏠 Netflix-style Home UI
* 📂 Category-based filtering (Movies / TV Shows)
* ⚡ Lazy loading for images (performance optimized)
* 🎯 Clean and responsive UI

### 🔍 Search Functionality

* Search movies by name
* Debounced search (prevents unnecessary API calls)
* Real-time results

### 🎬 Movie Preview

* Click on movie card to view details
* Modal popup UI
* Add to Watchlist

### 👤 Profile Features

* Watchlist stored in localStorage
* Persistent user data

### 📡 Offline Support

* Detect internet connection status
* Show offline banner

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Styling:** CSS
* **API:** imdbapi.dev
* **State Management:** React Hooks (useState, useEffect)

---

## 📁 Project Structure

```
src/
 ├── components/
 │   ├── Navbar.js
 │   ├── MovieCard.js
 │
 ├── pages/
 │   ├── Home.js
 │
 ├── services/
 │   ├── api.js
 │
 ├── App.js
 ├── index.js
```

---

## ⚙️ Installation & Setup

1. Clone the repository or extract the ZIP:

```
git clone <your-repo-link>
```

2. Navigate to project folder:

```
cd netflix-ui
```

3. Install dependencies:

```
npm install
```

4. Run the application:

```
npm start
```

5. Open in browser:

```
http://localhost:3000
```

---

## 🔌 API Usage

Base URL:

```
https://imdbapi.dev
```

Example:

```
/search?q=batman
/title/{id}
```

---

## ⚡ Performance Optimizations

* Lazy loading images (`loading="lazy"`)
* Efficient state updates
* Category filtering without extra API calls

---

## 🎯 Future Enhancements

* 🔐 Firebase Authentication (Login / Signup / Guest mode)
* 📜 Watch history tracking
* 🎞️ Advanced animations (Framer Motion)
* 🔄 Infinite scrolling
* 🌙 Dark mode toggle

---

## 🧾 Assignment Details

* 📌 Company: **Binaire Private Limited**
* 🧪 Task: Netflix-style Movie UI
* 🎯 Focus: Performance, UI, API integration, optimization

---

## 👨‍💻 Author

**Kunal Kumar**

* Full Stack Developer
* Skilled in React, Node.js, MongoDB

---

## 📬 Submission

Email your project with subject:

```
Javascript Developer - Netflix UI Assessment – [Your Name]
```

Send to:

```
hr@binaire.app
```

---

## ⭐ Final Notes

This project demonstrates:

* Clean UI/UX design
* API integration
* Performance optimization
* Real-world frontend development skills

---

🔥 *Feel free to fork, improve, and enhance the project!*
