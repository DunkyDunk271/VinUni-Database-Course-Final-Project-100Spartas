CREATE DATABASE IF NOT EXISTS HRIS;

USE HRIS;

-- Department Table
CREATE TABLE IF NOT EXISTS Department (
    DepartmentID INT AUTO_INCREMENT PRIMARY KEY,
    DeptName VARCHAR(100) NOT NULL UNIQUE
);

-- Employee Table
CREATE TABLE IF NOT EXISTS Employee (
    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    DOB DATE,
    Phone VARCHAR(15),
    Email VARCHAR(100) UNIQUE,
    Gender BINARY,
    DepartmentID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS Attendance (
    AttendanceID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    Date DATE NOT NULL,
    timeIn TIME,
    timeOut TIME,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
    UNIQUE(EmployeeID, Date)
);

-- Payroll Table
CREATE TABLE IF NOT EXISTS Payroll (
    PayrollID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    Salary DECIMAL(15,2) NOT NULL,
    Bonus DECIMAL(15,2) DEFAULT 0,
    Deduction DECIMAL(15,2) DEFAULT 0,
    PayDate DATE NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

-- Performance Review Table
CREATE TABLE IF NOT EXISTS PerformanceReview (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    ReviewDate DATE NOT NULL,
    Score INT CHECK (Score BETWEEN 1 AND 10),
    Comments TEXT,
    WorkingHours INT NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

-- Admin Table
CREATE TABLE IF NOT EXISTS `Admin` (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(50)
);

-- User Table
CREATE TABLE IF NOT EXISTS UserAccount (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    adminID INT NOT NULL UNIQUE,
    Username VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    FOREIGN KEY (adminID) REFERENCES `Admin`(AdminID)
);

USE HRIS;

-- Insert Departments
INSERT INTO Department (DeptName) VALUES
('Engineering'),
('Product Management'),
('Quality Assurance'),
('Human Resources'),
('Sales'),
('Marketing'),
('Customer Support'),
('IT Support'),
('Research and Development');

-- Insert Employees (50 total, first 3 fixed)
INSERT INTO Employee (FirstName, LastName, DOB, Phone, Email, Gender, DepartmentID) VALUES
('Thai Ba', 'Hung', '2004-01-10', '0983486677', '22hung.tb@vinuni.edu.vn', b'1', 1),
('Le Nguyen', 'Gia Binh', '2004-10-27', '0366998877', '22binh.lng@vinuni.edu.vn', b'0', 2),
('Nguyen Quoc', 'Dang', '2004-01-27', '0933393939', '22dang.nq@vinuni.edu.vn', b'0', 3),
('Anh', 'Tran', '1995-05-12', '0978123456', 'anh.tran@example.com', b'1', 1),
('Binh', 'Pham', '1992-11-23', '0987654321', 'binh.pham@example.com', b'1', 1),
('Chi', 'Le', '1998-07-05', '0967123456', 'chi.le@example.com', b'0', 4),
('Dung', 'Hoang', '1990-04-17', '0912345678', 'dung.hoang@example.com', b'1', 5),
('Em', 'Nguyen', '1997-08-29', '0934567890', 'em.nguyen@example.com', b'0', 1),
('Ha', 'Vu', '1989-12-01', '0945678901', 'ha.vu@example.com', b'0', 2),
('Hoa', 'Do', '1994-06-16', '0923456789', 'hoa.do@example.com', b'0', 6),
('Hung', 'Le', '1993-09-10', '0956789012', 'hung.le@example.com', b'1', 1),
('Khanh', 'Tran', '1996-03-08', '0976543210', 'khanh.tran@example.com', b'0', 7),
('Linh', 'Pham', '1991-02-25', '0901234567', 'linh.pham@example.com', b'0', 3),
('Minh', 'Nguyen', '1988-10-30', '0981234567', 'minh.nguyen@example.com', b'1', 1),
('Nam', 'Le', '1999-01-15', '0965432109', 'nam.le@example.com', b'1', 1),
('Nga', 'Hoang', '1995-07-22', '0932123456', 'nga.hoang@example.com', b'0', 4),
('Phuong', 'Vu', '1990-05-10', '0912345670', 'phuong.vu@example.com', b'0', 2),
('Quang', 'Do', '1993-11-11', '0943210987', 'quang.do@example.com', b'1', 5),
('Son', 'Tran', '1997-09-29', '0978987654', 'son.tran@example.com', b'1', 6),
('Tam', 'Pham', '1986-04-12', '0921098765', 'tam.pham@example.com', b'0', 7),
('Thao', 'Nguyen', '1994-12-24', '0934567012', 'thao.nguyen@example.com', b'0', 3),
('Tuan', 'Le', '1992-06-03', '0987654322', 'tuan.le@example.com', b'1', 1),
('Van', 'Hoang', '1991-03-14', '0912345671', 'van.hoang@example.com', b'1', 1),
('Vy', 'Vu', '1996-11-27', '0945678902', 'vy.vu@example.com', b'0', 4),
('Xuan', 'Do', '1989-01-30', '0976543211', 'xuan.do@example.com', b'1', 5),
('Yen', 'Tran', '1993-07-18', '0901234568', 'yen.tran@example.com', b'0', 2),
('An', 'Pham', '1998-09-22', '0981234568', 'an.pham@example.com', b'1', 1),
('Bich', 'Nguyen', '1995-05-17', '0965432108', 'bich.nguyen@example.com', b'0', 7),
('Cuong', 'Le', '1990-02-21', '0932123457', 'cuong.le@example.com', b'1', 6),
('Diep', 'Hoang', '1997-10-05', '0912345672', 'diep.hoang@example.com', b'0', 3),
('Gia', 'Vu', '1991-12-11', '0943210988', 'gia.vu@example.com', b'1', 1),
('Hai', 'Do', '1988-07-07', '0978987655', 'hai.do@example.com', b'1', 5),
('Hien', 'Tran', '1994-01-03', '0921098766', 'hien.tran@example.com', b'0', 4),
('Hoa', 'Pham', '1996-04-23', '0934567013', 'hoa.pham@example.com', b'0', 2),
('Kiet', 'Nguyen', '1993-08-19', '0987654323', 'kiet.nguyen@example.com', b'1', 1),
('Lam', 'Le', '1990-05-06', '0912345673', 'lam.le@example.com', b'1', 7),
('Lien', 'Hoang', '1997-11-28', '0945678903', 'lien.hoang@example.com', b'0', 3),
('Long', 'Vu', '1989-03-12', '0976543212', 'long.vu@example.com', b'1', 1),
('Mai', 'Do', '1995-06-25', '0901234569', 'mai.do@example.com', b'0', 4),
('Nam', 'Tran', '1992-10-15', '0981234569', 'nam.tran@example.com', b'1', 6),
('Nga', 'Pham', '1990-02-14', '0965432107', 'nga.pham@example.com', b'0', 2),
('Phong', 'Nguyen', '1994-08-21', '0932123458', 'phong.nguyen@example.com', b'1', 1),
('Quynh', 'Le', '1998-03-09', '0912345674', 'quynh.le@example.com', b'0', 3),
('Son', 'Hoang', '1991-07-26', '0943210989', 'son.hoang@example.com', b'1', 5),
('Thuy', 'Vu', '1996-12-13', '0978987656', 'thuy.vu@example.com', b'0', 4),
('Trang', 'Do', '1988-11-30', '0921098767', 'trang.do@example.com', b'0', 2);

-- Attendance for 10 employees, over 5 working days (Mon-Fri)
-- Mix on-time, late, early out, and absences (skipped days)

INSERT INTO Attendance (EmployeeID, Date, timeIn, timeOut) VALUES
-- Employee 1 (Mostly on time)
(1, '2025-05-19', '08:55:00', '18:05:00'),
(1, '2025-05-20', '09:00:00', '18:00:00'),
(1, '2025-05-21', '09:05:00', '17:55:00'),
(1, '2025-05-22', '08:50:00', '18:10:00'),
(1, '2025-05-23', '09:00:00', '18:00:00'),

-- Employee 2 (Some late, one absence on 2025-05-22)
(2, '2025-05-19', '09:20:00', '18:00:00'),
(2, '2025-05-20', '09:15:00', '18:05:00'),
(2, '2025-05-21', '09:30:00', '17:50:00'),
-- Missing 2025-05-22 means absent
(2, '2025-05-23', '09:10:00', '18:00:00'),

-- Employee 3 (Early arrival, early leave)
(3, '2025-05-19', '07:45:00', '17:00:00'),
(3, '2025-05-20', '08:00:00', '17:15:00'),
(3, '2025-05-21', '08:30:00', '17:45:00'),
(3, '2025-05-22', '08:10:00', '17:30:00'),
(3, '2025-05-23', '07:50:00', '17:00:00'),

-- Employee 4 (Perfect attendance but leaves early on Friday)
(4, '2025-05-19', '09:00:00', '18:00:00'),
(4, '2025-05-20', '09:00:00', '18:00:00'),
(4, '2025-05-21', '09:00:00', '18:00:00'),
(4, '2025-05-22', '09:00:00', '18:00:00'),
(4, '2025-05-23', '09:00:00', '16:30:00'),

-- Employee 5 (Late arrival most days)
(5, '2025-05-19', '09:30:00', '18:00:00'),
(5, '2025-05-20', '09:45:00', '18:00:00'),
(5, '2025-05-21', '10:00:00', '18:00:00'),
(5, '2025-05-22', '09:40:00', '18:00:00'),
(5, '2025-05-23', '09:35:00', '18:00:00'),

-- Employee 6 (Absent on Wed)
(6, '2025-05-19', '09:05:00', '18:05:00'),
(6, '2025-05-20', '09:00:00', '18:00:00'),
-- No record for 2025-05-21 (absent)
(6, '2025-05-22', '09:00:00', '18:00:00'),
(6, '2025-05-23', '09:00:00', '18:00:00'),

-- Employee 7 (Random late days)
(7, '2025-05-19', '09:10:00', '18:00:00'),
(7, '2025-05-20', '09:05:00', '18:05:00'),
(7, '2025-05-21', '08:55:00', '18:00:00'),
(7, '2025-05-22', '09:20:00', '18:00:00'),
(7, '2025-05-23', '09:00:00', '17:50:00'),

-- Employee 8 (Mostly early)
(8, '2025-05-19', '08:40:00', '17:50:00'),
(8, '2025-05-20', '08:30:00', '18:00:00'),
(8, '2025-05-21', '08:45:00', '18:00:00'),
(8, '2025-05-22', '08:50:00', '18:05:00'),
(8, '2025-05-23', '08:55:00', '18:10:00'),

-- Employee 9 (Absent on Monday and Friday)
-- No record 2025-05-19
(9, '2025-05-20', '09:00:00', '18:00:00'),
(9, '2025-05-21', '09:10:00', '18:00:00'),
(9, '2025-05-22', '09:05:00', '18:00:00')
-- No record 2025-05-23
;


-- Sample Payroll Data (monthly salary for May 2025, random bonuses/deductions)

INSERT INTO Payroll (EmployeeID, Salary, Bonus, Deduction, PayDate) VALUES
(1, 20000000, 1000000, 0, '2025-05-31'),
(2, 18000000, 0, 500000, '2025-05-31'),
(3, 22000000, 1500000, 0, '2025-05-31'),
(4, 21000000, 0, 0, '2025-05-31'),
(5, 19000000, 1000000, 0, '2025-05-31');

-- Sample Performance Reviews (for Q1 2025)
INSERT INTO PerformanceReview (EmployeeID, ReviewDate, Score, Comments, WorkingHours) VALUES
(1, '2025-03-31', 8, 'Good performance, met all deadlines.', 480),
(2, '2025-03-31', 7, 'Reliable but needs improvement in communication.', 470),
(3, '2025-03-31', 9, 'Excellent problem-solving skills.', 490),
(4, '2025-03-31', 6, 'Average performance, should be more proactive.', 460),
(5, '2025-03-31', 8, 'Consistent and dependable.', 480);


INSERT INTO Admin (FirstName, LastName, Email) VALUES
('Thai Ba', 'Hung', '22hung.tb@vinuni.edu.vn'),
('Le Nguyen', 'Gia Binh', '22binh.lng@vinuni.edu.vn'),
('Nguyen Quoc', 'Dang', '22dang.nq@vinuni.edu.vn');

INSERT INTO UserAccount (adminID, Username, `password`) VALUES
(1, 'hung_admin', 'pass123'),
(2, 'binh_admin', 'pass123'),
(3, 'dang_admin', 'pass123');

-- Procedure
-- Add a new employee
DELIMITER $$
CREATE PROCEDURE sp_add_employee(
    IN fName VARCHAR(50),
    IN lName VARCHAR(50),
    IN dob DATE,
    IN phone VARCHAR(15),
    IN email VARCHAR(100),
    IN gender BINARY,
    IN deptID INT
)
BEGIN
    INSERT INTO Employee (FirstName, LastName, DOB, Phone, Email, Gender, DepartmentID)
    VALUES (fName, lName, dob, phone, email, gender, deptID);
END$$
DELIMITER ;

-- Update employee phone and department
DELIMITER $$
CREATE PROCEDURE sp_update_employee_contact(
    IN empID INT,
    IN newPhone VARCHAR(15),
    IN newDeptID INT
)
BEGIN
    UPDATE Employee
    SET Phone = newPhone, DepartmentID = newDeptID
    WHERE EmployeeID = empID;
END$$
DELIMITER ;

CREATE TABLE IF NOT EXISTS AuditLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    TableName VARCHAR(50),
    ActionType VARCHAR(20),
    ActionTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PerformedBy INT, -- Can be tied to UserID or AdminID
    Description TEXT
);

DELIMITER $$
CREATE TRIGGER trg_audit_employee_update
AFTER UPDATE ON Employee
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (TableName, ActionType, PerformedBy, Description)
    VALUES ('Employee', 'UPDATE', NULL, CONCAT('Updated EmployeeID: ', OLD.EmployeeID));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_validate_attendance
BEFORE INSERT ON Attendance
FOR EACH ROW
BEGIN
    IF NEW.timeOut <= NEW.timeIn THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid attendance time: timeOut must be after timeIn';
    END IF;
END$$
DELIMITER ;

-- Index for faster lookups on foreign keys and filtering
CREATE INDEX idx_employee_dept ON Employee(DepartmentID);
CREATE INDEX idx_attendance_date ON Attendance(EmployeeID, Date);
CREATE INDEX idx_payroll_paydate ON Payroll(PayDate);
CREATE INDEX idx_review_date ON PerformanceReview(ReviewDate);
ALTER TABLE Attendance
PARTITION BY RANGE (MONTH(Date)) (
PARTITION p1 VALUES LESS THAN (2),
PARTITION p2 VALUES LESS THAN (3),
PARTITION p3 VALUES LESS THAN (4),
PARTITION p4 VALUES LESS THAN (5),
PARTITION p5 VALUES LESS THAN (6),
PARTITION p6 VALUES LESS THAN (7),
PARTITION p7 VALUES LESS THAN (8),
PARTITION p8 VALUES LESS THAN (9),
PARTITION p9 VALUES LESS THAN (10),
PARTITION p10 VALUES LESS THAN (11),
PARTITION p11 VALUES LESS THAN (12),
PARTITION p12 VALUES LESS THAN (13)
);
