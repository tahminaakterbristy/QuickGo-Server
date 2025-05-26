# Server for QuickGo Courier
# Live site: https://quick-goo.netlify.app
# Client-side repository: https://github.com/tahminaakterbristy/QuickGo-Courier


This is the backend/server-side application for the "QuickGo Courier" web application. It handles RESTful API routes, communicates with the MongoDB database, manages authentication and authorization, and processes all the core logic required by the frontend.

##  Features
###  Role-based Access
- Users and Admins have separate roles with different permissions.
- Admin can promote or demote users and delete any user.
- Services are loaded from the backend via REST API.
- Each service includes a detailed view accessible by ID.
- Reviews are fetched from the backend.
- Users can view reviews for each service.

###  Parcel Management (User)
- Users can create/add parcels through a form.
- Added parcels are visible in the user's dashboard.
- Users can track parcel status (e.g., Pending, Accepted, Delivered).

###  Parcel Management (Admin)
- Admin can view all parcels in the system.
- Admin can **Accept**, **Delete**, **Mark as Approved**, or **Mark as Delivered**.
- Changes in parcel status are reflected in the user's dashboard.

###  Dashboard & Analytics
- Admin dashboard shows parcel statistics (e.g., how many parcels in each status) using charts/graphs.
- Real-time parcel status update visible to respective users.



###  Installation
1. Clone the repository:
```bash
git clone https://github.com/tahminaakterbristy/QuickGo-Server.git
cd QuickGo-Server
