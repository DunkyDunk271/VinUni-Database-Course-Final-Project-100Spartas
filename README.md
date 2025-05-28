# VinUni-Database-Course-Final-Project-100Spartas

# HRIS Database System

## Project Description

The Human Resources Information System (HRIS) is a comprehensive software solution designed to manage employee data, track performance, handle payroll, and streamline various HR processes within an organization. This system solves the problem of inefficient HR operations by digitizing and centralizing employee data, improving workflow efficiency, and enabling HR managers to make data-driven decisions.

## 1. Functional & Non-functional Requirements

### Functional Requirements:
- **Employee Management**: Add, update, and delete employee records.
- **Attendance Tracking**: Track employee attendance, including leave requests and working hours.
- **Payroll Management**: Calculate and generate monthly payrolls for employees.
- **Performance Evaluation**: Store and manage performance reviews, feedback, and appraisal data.
- **Role-Based Access Control**: Different user roles (HR manager, employee, admin) with specific permissions.

### Non-functional Requirements:
- **Scalability**: System should be able to handle a growing number of employees.
- **Security**: Secure access to sensitive employee data with proper encryption and authentication.
- **Reliability**: System must ensure high availability with minimal downtime.

## 2. Planned Core Entities
- **Employee**: Stores personal details, contact information, job role, and employment history.
- **Attendance**: Tracks employee attendance, leaves, and working hours.
- **Payroll**: Stores payroll data, including salary, bonuses, and deductions.
- **Performance Review**: Stores evaluations, feedback, and appraisals of employees.
- **User**: Manages access control and user roles within the system.

## 3. Tech Stack
- **Database**: MySQL
- **Backend**: Python
- **Frontend**: HTML, CSS, Javascript
- **Authentication**: JWT (JSON Web Tokens) for secure access control
- **Deployment**: Docker for containerization

## 4. Team Members and Roles
- **Team Lead**: Le Nguyen Gia Binh – Oversees the project and coordinates the team.
- **Backend Developer**: Thai Ba Hung – Responsible for database design and API development.
- **Frontend Developer**: Le Nguyen Gia Binh – Handles any user interface design (if applicable).
- **Database Administrator**: Nguyen Quoc Dang – Responsible for database setup, schema design, and management.

## 5. Timeline
- **Week 1**: Database schema design and setup.
- **Week 2**: Development of core functionality (employee management, attendance tracking).
- **Week 3**: Implementation of payroll and performance review modules.
- **Week 4**: Testing, bug fixes, and documentation.
- **Final Week**: Final presentation and submission.     

## 6. Setup Instructions
This setup is for Windows, If you use MacOS or Ubuntu, use the suitable command for those OS.

### Database setup
- Install and start MySQL Server with name `root` and password `1234abcd`
- Paste the Project_script.sql to the script and run in MySQL Workbench.

### Backend Setup
- Navigate to the project root directory: \
  `cd VinUni-Database-Course-Final-Project-100Spartas`
- Install required Python packages:  \
  `pip install -r requirements.txt`
- Verify database connection in `main.py:` Check that the connection string matches your MySQL credentials \
  `DATABASE_URL = "mysql+pymysql://root:1234abcd@localhost:3306/HRIS"`

### Frontend Setup
- Navigate to the frontend directory: \
  `cd frontend`
- Install all required npm packages: \
  `npm install` \
  `npm install --save-dev concurrently` \
  `npm install file-saver`

### Running the Application
- Option 1: Run Both Services Concurrently \
  From the frontend directory:
   `npm run start`
- Option 2: Run Services Separately \
   Backend: \
  `cd VinUni-Database-Course-Final-Project-100Spartas \
   python -m uvicorn main:app --reload`
   Frontend: \
  `cd frontend \
   npm run dev`

### Accessing the Application
- Frontend: http://localhost:8081 (or check console output for exact port)
- Backend API: http://127.0.0.1:8000
- API Documentation: http://127.0.0.1:8000/docs

### Default Login Credentials
- Username: `hung_admin`
- Password: `pass123`



