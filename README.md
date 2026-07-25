# ⚡ FOCUS_SYS // TIME-LEDGER

> A terminal-inspired focus & time telemetry workspace built to decompose long-term goals into structured execution sequences, track real-time focus blocks, and log interruption analytics.

---

## 🛠️ Tech Stack

### **Backend**
* **Framework:** Python 3.x / Django 5.x & Django REST Framework (DRF)
* **Database:** PostgreSQL
* **Authentication:** Token-based Authentication (DRF Auth Token)
* **Serialization:** DRF Serializers with nested writable sequence handling

### **Frontend**
* **Framework:** React (Vite)
* **Routing:** React Router v6
* **Styling:** Tailwind CSS (Cyberpunk/Terminal dark mode theme)
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **State Management:** React Context API (`AuthContext`, `TaskContext`)

---

## ✨ Features Built So Far

* 📱 **Mobile-Responsive Terminal Layout:** Sleek dark-mode dashboard featuring a collapsible/slide-over sidebar navigation, animated user account dropup menu, and full touch support.
* 📋 **Task Plan Decomposer:** 
  * Step-by-step modal wizard to define target output hours, category, and preferred interval lengths ($25\text{m}$, $45\text{m}$, or $60\text{m}$).
  * Automatic sequence subtask block generation.
* ⏱️ **Focus Execution Engine:**
  * Animated radial SVG timer for focus blocks.
  * Pause telemetry diagnostic logging (reasons, duration, and custom notes).
  * Post-session review modal supporting full task completion or carryover block auto-insertion.
* 🔒 **Secure Authentication:** User login, session management, and JWT/Token persistence.

---

## 📁 Project Structure

```text
TIME-LEDGER/
├── backend/                  # Django REST API
│   ├── tasks/
│   │   ├── models.py         # TaskPlan, FocusSession, PauseLog models
│   │   ├── serializers.py    # Nested serializers with custom .create()
│   │   ├── views.py          # FBVs / CBVs for plans, sessions & telemetry
│   │   └── urls.py
│   └── manage.py
│
└── frontend/                 # Vite + React Application
    ├── src/
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── TaskContext.jsx
    │   ├── shared/
    │   │   └── components/
    │   │       ├── Sidebar.jsx
    │   │       └── PageTransition.jsx
    │   ├── features/
    │   │   ├── dashboard/
    │   │   │   └── layouts/
    │   │   │       └── DashboardLayout.jsx
    │   │   └── tasks/
    │   │       ├── pages/
    │   │       │   ├── TasksPage.jsx
    │   │       │   └── TaskDetailsPage.jsx
    │   │       └── components/
    │   │           ├── SessionTimerModal.jsx
    │   │           ├── PauseReasonModal.jsx
    │   │           ├── SessionReviewModal.jsx
    │   │           └── TaskCard.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js


    # Navigate to backend folder
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install django djangorestframework django-cors-headers psycopg2-binary

# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Start development server
python manage.py runserver


# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev

