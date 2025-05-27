
import api from '@/lib/api';
import { Department } from '@/types/api';

export const departmentService = {
  async getDepartments(): Promise<Department[]> {
    const response = await api.get('/departments/');
    return response.data;
  },

  async getDepartment(id: number): Promise<Department> {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  async createDepartment(department: Omit<Department, 'DepartmentID'>): Promise<Department> {
    const response = await api.post('/departments/', department);
    return response.data;
  },

  async updateDepartment(id: number, department: Omit<Department, 'DepartmentID'>): Promise<Department> {
    const response = await api.put(`/departments/${id}`, department);
    return response.data;
  },

  async deleteDepartment(id: number): Promise<void> {
    await api.delete(`/departments/${id}`);
  }
};
