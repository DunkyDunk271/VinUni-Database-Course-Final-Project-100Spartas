
import api from '@/lib/api';
import { Employee } from '@/types/api';

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    const response = await api.get('/employees/');
    return response.data;
  },

  async getEmployee(id: number): Promise<Employee> {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  async createEmployee(employee: Omit<Employee, 'EmployeeID'>): Promise<Employee> {
    const response = await api.post('/employees/', employee);
    return response.data;
  },

  async updateEmployee(id: number, employee: Omit<Employee, 'EmployeeID'>): Promise<Employee> {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data;
  },

  async deleteEmployee(id: number): Promise<void> {
    await api.delete(`/employees/${id}`);
  }
};
