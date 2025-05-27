from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, constr
from typing import List, Optional
from sqlalchemy import (
    create_engine, Column, Integer, String, Date, ForeignKey, BINARY, Time, DECIMAL, Text,
    CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import sessionmaker, declarative_base, Session, relationship
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta   
from fastapi.middleware.cors import CORSMiddleware
import sys

# --- CONFIG ---
DATABASE_URL = "mysql+pymysql://root:1234abcd@localhost:3306/HRIS"
SECRET_KEY = "hungngu"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# --- SETUP ---
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
app = FastAPI(title="HRIS FastAPI Backend")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "http://localhost:8081",  # your frontend origin
    # you can add more origins or use "*" for all (not recommended for production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],    # allow all HTTP methods (GET, POST, etc)
    allow_headers=["*"],    # allow all headers
)


# --- MODELS ---
class Department(Base):
    __tablename__ = "Department"
    DepartmentID = Column(Integer, primary_key=True, index=True)
    DeptName = Column(String(100), unique=True, nullable=False)
    employees = relationship("Employee", back_populates="department")

class Employee(Base):
    __tablename__ = "Employee"
    EmployeeID = Column(Integer, primary_key=True, index=True)
    FirstName = Column(String(50), nullable=False)
    LastName = Column(String(50), nullable=False)
    DOB = Column(Date)
    Phone = Column(String(15))
    Email = Column(String(100), unique=True)
    Gender = Column(BINARY)
    DepartmentID = Column(Integer, ForeignKey("Department.DepartmentID"))
    department = relationship("Department", back_populates="employees")
    attendances = relationship("Attendance", back_populates="employee")
    payrolls = relationship("Payroll", back_populates="employee")
    performance_reviews = relationship("PerformanceReview", back_populates="employee")

class Attendance(Base):
    __tablename__ = "Attendance"
    AttendanceID = Column(Integer, primary_key=True, index=True)
    EmployeeID = Column(Integer, ForeignKey("Employee.EmployeeID"), nullable=False)
    Date = Column(Date, nullable=False)
    timeIn = Column(Time)
    timeOut = Column(Time)
    employee = relationship("Employee", back_populates="attendances")
    __table_args__ = (UniqueConstraint('EmployeeID', 'Date', name='uix_employee_date'),)

class Payroll(Base):
    __tablename__ = "Payroll"
    PayrollID = Column(Integer, primary_key=True, index=True)
    EmployeeID = Column(Integer, ForeignKey("Employee.EmployeeID"), nullable=False)
    Salary = Column(DECIMAL(15, 2), nullable=False)
    Bonus = Column(DECIMAL(15, 2), default=0)
    Deduction = Column(DECIMAL(15, 2), default=0)
    PayDate = Column(Date, nullable=False)
    employee = relationship("Employee", back_populates="payrolls")

class PerformanceReview(Base):
    __tablename__ = "PerformanceReview"
    ReviewID = Column(Integer, primary_key=True, index=True)
    EmployeeID = Column(Integer, ForeignKey("Employee.EmployeeID"), nullable=False)
    ReviewDate = Column(Date, nullable=False)
    Score = Column(Integer, nullable=False)
    Comments = Column(Text)
    WorkingHours = Column(Integer, nullable=False)
    employee = relationship("Employee", back_populates="performance_reviews")
    __table_args__ = (CheckConstraint('Score BETWEEN 1 AND 10', name='chk_score_range'),)

class Admin(Base):
    __tablename__ = "Admin"
    AdminID = Column(Integer, primary_key=True, index=True)
    FirstName = Column(String(50))
    LastName = Column(String(50))
    Email = Column(String(50))
    user_account = relationship("UserAccount", back_populates="admin", uselist=False)

class UserAccount(Base):
    __tablename__ = "UserAccount"
    UserID = Column(Integer, primary_key=True, index=True)
    adminID = Column(Integer, ForeignKey("Admin.AdminID"), unique=True, nullable=False)
    Username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    admin = relationship("Admin", back_populates="user_account")

# --- Pydantic Schemas ---
# Department
class DepartmentBase(BaseModel):
    DeptName: constr(max_length=100)
class DepartmentCreate(DepartmentBase): pass
class DepartmentRead(DepartmentBase):
    DepartmentID: int
    class Config: orm_mode = True

# Employee
class EmployeeBase(BaseModel):
    FirstName: constr(max_length=50)
    LastName: constr(max_length=50)
    DOB: Optional[str] = None
    Phone: Optional[constr(max_length=15)] = None
    Email: Optional[EmailStr] = None
    Gender: Optional[int] = None  # 0 or 1
    DepartmentID: Optional[int] = None
class EmployeeCreate(EmployeeBase): pass
class EmployeeRead(EmployeeBase):
    EmployeeID: int
    class Config: orm_mode = True

# Attendance
class AttendanceBase(BaseModel):
    EmployeeID: int
    Date: str
    timeIn: Optional[str] = None
    timeOut: Optional[str] = None
class AttendanceCreate(AttendanceBase): pass
class AttendanceRead(AttendanceBase):
    AttendanceID: int
    class Config: orm_mode = True

# Payroll
class PayrollBase(BaseModel):
    EmployeeID: int
    Salary: float
    Bonus: Optional[float] = 0
    Deduction: Optional[float] = 0
    PayDate: str
class PayrollCreate(PayrollBase): pass
class PayrollRead(PayrollBase):
    PayrollID: int
    class Config: orm_mode = True

# PerformanceReview
class PerformanceReviewBase(BaseModel):
    EmployeeID: int
    ReviewDate: str
    Score: int
    Comments: Optional[str] = None
    WorkingHours: int
class PerformanceReviewCreate(PerformanceReviewBase): pass
class PerformanceReviewRead(PerformanceReviewBase):
    ReviewID: int
    class Config: orm_mode = True

# Admin
class AdminBase(BaseModel):
    FirstName: Optional[constr(max_length=50)] = None
    LastName: Optional[constr(max_length=50)] = None
    Email: Optional[EmailStr] = None
class AdminCreate(AdminBase): pass
class AdminRead(AdminBase):
    AdminID: int
    class Config: orm_mode = True

# UserAccount
class UserAccountBase(BaseModel):
    adminID: int
    Username: constr(max_length=50)
    password: constr(min_length=4)
class UserAccountCreate(UserAccountBase): pass
class UserAccountRead(UserAccountBase):
    UserID: int
    class Config: orm_mode = True

# --- DB Session Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- AUTH UTILITIES ---
def verify_password(plain_password, stored_password):
    return plain_password == stored_password

def get_password_hash(password):
    return password

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user(db: Session, username: str):
    return db.query(UserAccount).filter(UserAccount.Username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    debug_print(f"Authenticating user: {user}")
    print(f"Authenticating user: {user}")
    if not user:
        return False
    
    print(f"Comparing passwords: '{password}' with '{user.password}'")
    # Simple direct comparison
    if password == user.password:
        print("Password matched successfully")
        return user
    
    print(f"Password mismatch for user: {username}")
    return False

# --- TOKEN MODELS ---
class Token(BaseModel):
    access_token: str
    token_type: str
class TokenData(BaseModel):
    username: Optional[str] = None

# --- CURRENT USER DEPENDENCY ---
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(db, token_data.username)
    if user is None:
        raise credentials_exception
    return user
async def get_current_active_user(current_user: UserAccount = Depends(get_current_user)):
    return current_user

# --- TOKEN ENDPOINT ---
@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    print(f"==== LOGIN ATTEMPT ====")
    print(f"Username: {form_data.username}")
    print(f"Password: {form_data.password}")
    
    # Test database connection
    try:
        user_count = db.query(UserAccount).count()
        print(f"Total users in database: {user_count}")
    except Exception as e:
        print(f"Database error: {e}")

    user = authenticate_user(db, form_data.username, form_data.password)
    print(f"Login attempt for user: {form_data.username}")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.Username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- CRUD ENDPOINTS (Examples below are protected with JWT) ---

# Department CRUD
@app.post("/departments/", response_model=DepartmentRead)
def create_department(dept: DepartmentCreate, db: Session = Depends(get_db),
                      current_user: UserAccount = Depends(get_current_active_user)):
    db_dept = Department(DeptName=dept.DeptName)
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

@app.get("/departments/", response_model=List[DepartmentRead])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                     current_user: UserAccount = Depends(get_current_active_user)):
    return db.query(Department).offset(skip).limit(limit).all()

@app.get("/departments/{department_id}", response_model=DepartmentRead)
def read_department(department_id: int, db: Session = Depends(get_db),
                    current_user: UserAccount = Depends(get_current_active_user)):
    dept = db.query(Department).filter(Department.DepartmentID == department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    return dept

@app.put("/departments/{department_id}", response_model=DepartmentRead)
def update_department(department_id: int, dept_update: DepartmentCreate, db: Session = Depends(get_db),
                      current_user: UserAccount = Depends(get_current_active_user)):
    dept = db.query(Department).filter(Department.DepartmentID == department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    dept.DeptName = dept_update.DeptName
    db.commit()
    db.refresh(dept)
    return dept

@app.delete("/departments/{department_id}")
def delete_department(department_id: int, db: Session = Depends(get_db),
                      current_user: UserAccount = Depends(get_current_active_user)):
    dept = db.query(Department).filter(Department.DepartmentID == department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    db.delete(dept)
    db.commit()
    return {"detail": "Department deleted"}

# Employee CRUD
@app.post("/employees/", response_model=EmployeeRead)
def create_employee(emp: EmployeeCreate, db: Session = Depends(get_db),
                    current_user: UserAccount = Depends(get_current_active_user)):
    db_emp = Employee(
        FirstName=emp.FirstName,
        LastName=emp.LastName,
        DOB=emp.DOB,
        Phone=emp.Phone,
        Email=emp.Email,
        Gender=bytes([emp.Gender]) if emp.Gender is not None else None,
        DepartmentID=emp.DepartmentID,
    )
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    if db_emp.Gender is not None:
        db_emp.Gender = int.from_bytes(db_emp.Gender, "big")
    return db_emp

@app.get("/employees/", response_model=List[EmployeeRead])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                   current_user: UserAccount = Depends(get_current_active_user)):
    emps = db.query(Employee).offset(skip).limit(limit).all()
    for e in emps:
        if e.Gender is not None:
            e.Gender = int.from_bytes(e.Gender, "big")
    return emps

@app.get("/employees/{employee_id}", response_model=EmployeeRead)
def read_employee(employee_id: int, db: Session = Depends(get_db),
                  current_user: UserAccount = Depends(get_current_active_user)):
    emp = db.query(Employee).filter(Employee.EmployeeID == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    if emp.Gender is not None:
        emp.Gender = int.from_bytes(emp.Gender, "big")
    return emp

@app.put("/employees/{employee_id}", response_model=EmployeeRead)
def update_employee(employee_id: int, emp_update: EmployeeCreate, db: Session = Depends(get_db),
                    current_user: UserAccount = Depends(get_current_active_user)):
    emp = db.query(Employee).filter(Employee.EmployeeID == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    emp.FirstName = emp_update.FirstName
    emp.LastName = emp_update.LastName
    emp.DOB = emp_update.DOB
    emp.Phone = emp_update.Phone
    emp.Email = emp_update.Email
    emp.Gender = bytes([emp_update.Gender]) if emp_update.Gender is not None else None
    emp.DepartmentID = emp_update.DepartmentID
    db.commit()
    db.refresh(emp)
    if emp.Gender is not None:
        emp.Gender = int.from_bytes(emp.Gender, "big")
    return emp

@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db),
                    current_user: UserAccount = Depends(get_current_active_user)):
    emp = db.query(Employee).filter(Employee.EmployeeID == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(emp)
    db.commit()
    return {"detail": "Employee deleted"}

# Attendance CRUD
@app.post("/attendances/", response_model=AttendanceRead)
def create_attendance(att: AttendanceCreate, db: Session = Depends(get_db),
                      current_user: UserAccount = Depends(get_current_active_user)):
    db_att = Attendance(
        EmployeeID=att.EmployeeID,
        Date=att.Date,
        timeIn=att.timeIn,
        timeOut=att.timeOut
    )
    db.add(db_att)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    db.refresh(db_att)
    return db_att

@app.get("/attendances/", response_model=List[AttendanceRead])
def read_attendances(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                     current_user: UserAccount = Depends(get_current_active_user)):
    return db.query(Attendance).offset(skip).limit(limit).all()

@app.get("/attendances/{attendance_id}", response_model=AttendanceRead)
def read_attendance(attendance_id: int, db: Session = Depends(get_db),
                    current_user: UserAccount = Depends(get_current_active_user)):
    att = db.query(Attendance).filter(Attendance.AttendanceID == attendance_id).first()
    if not att:
        raise HTTPException(status_code=404, detail="Attendance not found")
    return att

@app.put("/attendances/{attendance_id}", response_model=AttendanceRead)
def update_attendance(attendance_id: int, att_update: AttendanceCreate, db: Session = Depends(get_db),
                      current_user: UserAccount = Depends(get_current_active_user)):
    att = db.query(Attendance).filter(Attendance.AttendanceID == attendance_id).first()
    if not att:
        raise HTTPException(status_code=404, detail="Attendance not found")
    att.EmployeeID = att_update.EmployeeID
    att.Date = att_update.Date
    att.timeIn = att_update.timeIn
    att.timeOut = att_update.timeOut
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    db.refresh(att)
    return att

@app.delete("/attendances/{attendance_id}")
def delete_attendance(attendance_id: int, db: Session = Depends(get_db),
                      current_user: UserAccount = Depends(get_current_active_user)):
    att = db.query(Attendance).filter(Attendance.AttendanceID == attendance_id).first()
    if not att:
        raise HTTPException(status_code=404, detail="Attendance not found")
    db.delete(att)
    db.commit()
    return {"detail": "Attendance deleted"}

# Payroll CRUD
@app.post("/payrolls/", response_model=PayrollRead)
def create_payroll(pay: PayrollCreate, db: Session = Depends(get_db),
                   current_user: UserAccount = Depends(get_current_active_user)):
    db_pay = Payroll(
        EmployeeID=pay.EmployeeID,
        Salary=pay.Salary,
        Bonus=pay.Bonus,
        Deduction=pay.Deduction,
        PayDate=pay.PayDate,
    )
    db.add(db_pay)
    db.commit()
    db.refresh(db_pay)
    return db_pay

@app.get("/payrolls/", response_model=List[PayrollRead])
def read_payrolls(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                  current_user: UserAccount = Depends(get_current_active_user)):
    return db.query(Payroll).offset(skip).limit(limit).all()

@app.get("/payrolls/{payroll_id}", response_model=PayrollRead)
def read_payroll(payroll_id: int, db: Session = Depends(get_db),
                 current_user: UserAccount = Depends(get_current_active_user)):
    pay = db.query(Payroll).filter(Payroll.PayrollID == payroll_id).first()
    if not pay:
        raise HTTPException(status_code=404, detail="Payroll not found")
    return pay

@app.put("/payrolls/{payroll_id}", response_model=PayrollRead)
def update_payroll(payroll_id: int, pay_update: PayrollCreate, db: Session = Depends(get_db),
                   current_user: UserAccount = Depends(get_current_active_user)):
    pay = db.query(Payroll).filter(Payroll.PayrollID == payroll_id).first()
    if not pay:
        raise HTTPException(status_code=404, detail="Payroll not found")
    pay.EmployeeID = pay_update.EmployeeID
    pay.Salary = pay_update.Salary
    pay.Bonus = pay_update.Bonus
    pay.Deduction = pay_update.Deduction
    pay.PayDate = pay_update.PayDate
    db.commit()
    db.refresh(pay)
    return pay

@app.delete("/payrolls/{payroll_id}")
def delete_payroll(payroll_id: int, db: Session = Depends(get_db),
                   current_user: UserAccount = Depends(get_current_active_user)):
    pay = db.query(Payroll).filter(Payroll.PayrollID == payroll_id).first()
    if not pay:
        raise HTTPException(status_code=404, detail="Payroll not found")
    db.delete(pay)
    db.commit()
    return {"detail": "Payroll deleted"}

# PerformanceReview CRUD
@app.post("/performance_reviews/", response_model=PerformanceReviewRead)
def create_performance_review(pr: PerformanceReviewCreate, db: Session = Depends(get_db),
                              current_user: UserAccount = Depends(get_current_active_user)):
    db_pr = PerformanceReview(
        EmployeeID=pr.EmployeeID,
        ReviewDate=pr.ReviewDate,
        Score=pr.Score,
        Comments=pr.Comments,
        WorkingHours=pr.WorkingHours
    )
    db.add(db_pr)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    db.refresh(db_pr)
    return db_pr

@app.get("/performance_reviews/", response_model=List[PerformanceReviewRead])
def read_performance_reviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                             current_user: UserAccount = Depends(get_current_active_user)):
    return db.query(PerformanceReview).offset(skip).limit(limit).all()

@app.get("/performance_reviews/{review_id}", response_model=PerformanceReviewRead)
def read_performance_review(review_id: int, db: Session = Depends(get_db),
                            current_user: UserAccount = Depends(get_current_active_user)):
    pr = db.query(PerformanceReview).filter(PerformanceReview.ReviewID == review_id).first()
    if not pr:
        raise HTTPException(status_code=404, detail="Performance Review not found")
    return pr

@app.put("/performance_reviews/{review_id}", response_model=PerformanceReviewRead)
def update_performance_review(review_id: int, pr_update: PerformanceReviewCreate, db: Session = Depends(get_db),
                              current_user: UserAccount = Depends(get_current_active_user)):
    pr = db.query(PerformanceReview).filter(PerformanceReview.ReviewID == review_id).first()
    if not pr:
        raise HTTPException(status_code=404, detail="Performance Review not found")
    pr.EmployeeID = pr_update.EmployeeID
    pr.ReviewDate = pr_update.ReviewDate
    pr.Score = pr_update.Score
    pr.Comments = pr_update.Comments
    pr.WorkingHours = pr_update.WorkingHours
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    db.refresh(pr)
    return pr

@app.delete("/performance_reviews/{review_id}")
def delete_performance_review(review_id: int, db: Session = Depends(get_db),
                              current_user: UserAccount = Depends(get_current_active_user)):
    pr = db.query(PerformanceReview).filter(PerformanceReview.ReviewID == review_id).first()
    if not pr:
        raise HTTPException(status_code=404, detail="Performance Review not found")
    db.delete(pr)
    db.commit()
    return {"detail": "Performance Review deleted"}

# Admin CRUD
@app.post("/admins/", response_model=AdminRead)
def create_admin(ad: AdminCreate, db: Session = Depends(get_db),
                 current_user: UserAccount = Depends(get_current_active_user)):
    db_ad = Admin(
        FirstName=ad.FirstName,
        LastName=ad.LastName,
        Email=ad.Email,
    )
    db.add(db_ad)
    db.commit()
    db.refresh(db_ad)
    return db_ad

@app.get("/admins/", response_model=List[AdminRead])
def read_admins(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                current_user: UserAccount = Depends(get_current_active_user)):
    return db.query(Admin).offset(skip).limit(limit).all()

@app.get("/admins/{admin_id}", response_model=AdminRead)
def read_admin(admin_id: int, db: Session = Depends(get_db),
               current_user: UserAccount = Depends(get_current_active_user)):
    ad = db.query(Admin).filter(Admin.AdminID == admin_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Admin not found")
    return ad

@app.put("/admins/{admin_id}", response_model=AdminRead)
def update_admin(admin_id: int, ad_update: AdminCreate, db: Session = Depends(get_db),
                 current_user: UserAccount = Depends(get_current_active_user)):
    ad = db.query(Admin).filter(Admin.AdminID == admin_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Admin not found")
    ad.FirstName = ad_update.FirstName
    ad.LastName = ad_update.LastName
    ad.Email = ad_update.Email
    db.commit()
    db.refresh(ad)
    return ad

@app.delete("/admins/{admin_id}")
def delete_admin(admin_id: int, db: Session = Depends(get_db),
                 current_user: UserAccount = Depends(get_current_active_user)):
    ad = db.query(Admin).filter(Admin.AdminID == admin_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Admin not found")
    db.delete(ad)
    db.commit()
    return {"detail": "Admin deleted"}

# UserAccount CRUD (hash passwords on create/update)
@app.post("/user_accounts/", response_model=UserAccountRead)
def create_user_account(user: UserAccountCreate, db: Session = Depends(get_db),
                        current_user: UserAccount = Depends(get_current_active_user)):
    # Store password as plain text without hashing
    db_user = UserAccount(
        adminID=user.adminID,
        Username=user.Username,
        password=user.password,
    )
    db.add(db_user)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    db.refresh(db_user)
    return db_user

@app.get("/user_accounts/", response_model=List[UserAccountRead])
def read_user_accounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                       current_user: UserAccount = Depends(get_current_active_user)):
    return db.query(UserAccount).offset(skip).limit(limit).all()

@app.get("/user_accounts/{user_id}", response_model=UserAccountRead)
def read_user_account(user_id: int, db: Session = Depends(get_db),
                      current_user: UserAccount = Depends(get_current_active_user)):
    user = db.query(UserAccount).filter(UserAccount.UserID == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="UserAccount not found")
    return user

@app.put("/user_accounts/{user_id}", response_model=UserAccountRead)
def update_user_account(user_id: int, user_update: UserAccountCreate, db: Session = Depends(get_db),
                        current_user: UserAccount = Depends(get_current_active_user)):
    user = db.query(UserAccount).filter(UserAccount.UserID == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="UserAccount not found")
    user.adminID = user_update.adminID
    user.Username = user_update.Username
    user.password = user_update.password  # Plain text password
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    db.refresh(user)
    return user

@app.delete("/user_accounts/{user_id}")
def delete_user_account(user_id: int, db: Session = Depends(get_db),
                       current_user: UserAccount = Depends(get_current_active_user)):
    user = db.query(UserAccount).filter(UserAccount.UserID == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="UserAccount not found")
    db.delete(user)
    db.commit()
    return {"detail": "UserAccount deleted"}

@app.get("/debug/users/{username}")
async def debug_get_user(username: str, db: Session = Depends(get_db)):
    """Debug endpoint to check if a user exists in the database"""
    user = get_user(db, username)
    if user:
        # Don't return the actual password in production!
        return {
            "found": True,
            "username": user.Username,
            "password_starts_with": user.password[:10] + "..." if user.password else None
        }
    return {"found": False}

@app.get("/")
async def root():
    print("Root endpoint accessed")
    # Get DB statistics
    db = SessionLocal()
    try:
        user_count = db.query(UserAccount).count()
        admin_count = db.query(Admin).count()
        employee_count = db.query(Employee).count()
        
        return {
            "message": "HRIS API is running",
            "version": "1.0",
            "database_stats": {
                "users": user_count,
                "admins": admin_count,
                "employees": employee_count
            }
        }
    except Exception as e:
        return {
            "message": "HRIS API is running",
            "database_error": str(e)
        }
    finally:
        db.close()

def debug_print(*args, **kwargs):
    print(*args, **kwargs, flush=True)
    sys.stdout.flush()

# Use debug_print instead of print
debug_print("Root endpoint accessed")
