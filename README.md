# Online Learning Management System (OLMS)

A full stack web application built as a final year MCA capstone project. It's basically a simplified version of platforms like Udemy — students can browse and enroll in courses, instructors can create and manage course content, and admins can oversee the whole platform.

---

## What it does

- Students can browse courses, enroll after simulated payment, watch YouTube video lessons and PDF documents, track their progress, leave reviews, and manage a wishlist
- Instructors can create courses, add video/PDF modules, publish/unpublish courses, and see who's enrolled
- Admins can verify instructors, approve courses, manage users, and view platform analytics

---

## Tech stack

**Backend**
- Node.js + Express.js
- MySQL (raw SQL via mysql2 — no ORM)
- JWT for authentication
- bcrypt for password hashing
- Zod for request validation

**Frontend**
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast

---

## Project structure

```
OLMS/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authControllers/
│   │   │   ├── signupController.js
│   │   │   ├── signinController.js
│   │   │   ├── adminSigninController.js
│   │   │   ├── getMeController.js
│   │   │   └── changePasswordController.js
│   │   ├── courseController.js
│   │   ├── courseModuleController.js
│   │   ├── enrollmentController.js
│   │   ├── paymentController.js
│   │   ├── progressController.js
│   │   ├── wishlistController.js
│   │   ├── reviewController.js
│   │   ├── dashboardController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── studentModel.js
│   │   ├── instructorModel.js
│   │   ├── adminModel.js
│   │   ├── courseModel.js
│   │   ├── courseModuleModel.js
│   │   ├── enrollmentModel.js
│   │   ├── paymentModel.js
│   │   ├── progressModel.js
│   │   ├── wishlistModel.js
│   │   └── reviewModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── utils/
│   │   ├── sendResponse.js
│   │   └── generateToken.js
│   ├── scripts/
│   │   └── seedAdmin.js
│   ├── .env
│   ├── index.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js
    │   │   ├── authApi.js
    │   │   ├── courseApi.js
    │   │   ├── categoryApi.js
    │   │   ├── enrollmentApi.js
    │   │   ├── paymentApi.js
    │   │   ├── progressApi.js
    │   │   ├── wishlistApi.js
    │   │   ├── reviewApi.js
    │   │   ├── dashboardApi.js
    │   │   └── adminApi.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   ├── CourseCard.jsx
    │   │   │   ├── Loader.jsx
    │   │   │   ├── StarRating.jsx
    │   │   │   ├── ProgressBar.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   ├── StatusBadge.jsx
    │   │   │   ├── StudentLayout.jsx
    │   │   │   ├── InstructorLayout.jsx
    │   │   │   └── AdminLayout.jsx
    │   │   ├── player/
    │   │   │   ├── VideoPlayer.jsx
    │   │   │   └── PDFViewer.jsx
    │   │   ├── instructor/
    │   │   │   ├── CourseForm.jsx
    │   │   │   ├── ModuleForm.jsx
    │   │   │   └── ModuleItem.jsx
    │   │   └── admin/
    │   │       ├── DataTable.jsx
    │   │       └── StatCard.jsx
    │   ├── pages/
    │   │   ├── public/
    │   │   │   ├── Home.jsx
    │   │   │   ├── CourseDetail.jsx
    │   │   │   ├── Login.jsx
    │   │   │   ├── StudentSignup.jsx
    │   │   │   └── InstructorSignup.jsx
    │   │   ├── student/
    │   │   │   ├── StudentDashboard.jsx
    │   │   │   ├── MyEnrollments.jsx
    │   │   │   ├── LearnCourse.jsx
    │   │   │   ├── Wishlist.jsx
    │   │   │   ├── PaymentHistory.jsx
    │   │   │   └── StudentProfile.jsx
    │   │   ├── instructor/
    │   │   │   ├── InstructorDashboard.jsx
    │   │   │   ├── MyCourses.jsx
    │   │   │   ├── CreateCourse.jsx
    │   │   │   ├── EditCourse.jsx
    │   │   │   ├── ManageModules.jsx
    │   │   │   ├── CourseEnrollments.jsx
    │   │   │   └── InstructorProfile.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── ManageStudents.jsx
    │   │       ├── ManageInstructors.jsx
    │   │       ├── ManageCourses.jsx
    │   │       ├── ManagePayments.jsx
    │   │       └── ManageReviews.jsx
    │   ├── utils/
    │   │   ├── getYoutubeEmbed.js
    │   │   ├── formatDate.js
    │   │   └── formatPrice.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    └── package.json
```

---

## Database

Database name: `LmsDB`

11 tables: `Admin`, `Student`, `Instructor`, `Course`, `Course_Category`, `Course_Modules`, `Enrollments`, `Wishlist`, `Payments`, `Review`, `Progress`

One thing worth noting — the `Progress` table uses `progress_id` as primary key with a unique constraint on `(student_id, content_id)`. This lets us use MySQL's `INSERT ... ON DUPLICATE KEY UPDATE` to handle both first-time progress tracking and re-watches in a single query.

---

## Getting started

### Prerequisites
- Node.js v18+
- MySQL 8+
- npm

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT = 3000
mysql_password = 'Pradeep@123'
JWT_SECRET_KEY = "thisIsSoConfidential"
```

Create the database and run your SQL schema, then seed the admin account:

```bash
node scripts/seedAdmin.js
```

Start the server:

```bash
npm run dev
```

### Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

---

## API overview

52 APIs across 8 modules. All protected routes require a JWT token in the `Authorization: Bearer <token>` header.

| Module | Routes |
|---|---|
| Auth | signup, signin (student/instructor/admin), /me, change password |
| Courses | CRUD, publish/unpublish, search, filter by category |
| Course Modules | add, update, delete modules (video/PDF) |
| Enrollment | enroll, list enrolled courses, access modules |
| Progress | mark lesson watched, get progress % |
| Wishlist | add, view, remove |
| Reviews | submit, view, edit, delete |
| Admin | manage students, instructors, courses, payments, reviews |

---

## User roles

**Student** — browse courses, pay (simulated), enroll, watch content, track progress, review, wishlist

**Instructor** — create/manage courses, add YouTube video and PDF modules, publish courses, view enrolled students

**Admin** — verify instructors, approve/remove courses, manage all users, view platform stats and revenue

---

## A few design decisions worth mentioning

**No ORM** — all database queries are written in raw SQL using mysql2. This was intentional — it gives full control over queries and makes joins easier to reason about.

**Simulated payments** — there's no real payment gateway. The flow is: initiate (creates a pending record) → verify (flips status to success) → enroll. This keeps the demo clean without needing Razorpay or Stripe keys.

**YouTube + PDF embeds** — instructors paste YouTube URLs or public PDF links when creating modules. The frontend converts YouTube URLs to embed format and uses Google Docs viewer for PDFs. No file uploads, no storage costs.

**Single `/api/auth/me` endpoint** — instead of separate profile endpoints per role, one endpoint checks the JWT role and queries the right table. Keeps things simple.

**Role-based middleware** — a single `roleMiddleware(...roles)` function handles access control across all routes. Admin routes use `AdminRouter.use(authMiddleware, roleMiddleware("admin"))` to apply middleware globally instead of per-route.

---

## Test credentials (after seeding)

```
Admin email:    admin@olms.com
Admin password: admin@123
```

For students and instructors, use the signup pages.

---

## Known limitations

- No real payment gateway integration (simulated only)
- No file upload support — instructors must use external URLs for thumbnails, videos, and PDFs
- No email verification or password reset flow
- No real-time features (notifications, live classes)

These are all listed as future scope in the project synopsis.

---

## Future scope

Things that could be added later with more time:

- Razorpay/Stripe payment integration
- Email notifications on enrollment and verification
- Certificate generation on course completion
- AI-based course recommendations
- Mobile app (React Native)
- Live classes via WebRTC or third-party SDK
- Multilingual support

---

*Built as a final year MCA project.*