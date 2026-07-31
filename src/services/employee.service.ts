import { EmployeeRepository } from "../repositories/employee.repository";
import { getImageUrl } from "../utils/image-url";

const employeeRepository = new EmployeeRepository();

export class EmployeeService {
    async getEmployees() {
        const employees = await employeeRepository.getEmployees();

        return employees.map(employee => ({
            ...employee,
            image: getImageUrl(employee.image),
        }));
    }

    async getEmployee(id: string) {
        const employee = await employeeRepository.getEmployeeById(id);

        if (!employee) {
            return null;
        }

        return {
            ...employee,
            image: getImageUrl(employee.image),
        };
    }

    async createEmployee(data: any) {
        return employeeRepository.createEmployee({
            id: crypto.randomUUID(),

            name: data.name,
            image: data.image,
            dob: data.dob || null,
            holidayDemand: data.holidayDemand,
            designation: data.designation,
            gender: data.gender,
            joiningDate: data.joiningDate || null,
            mobile: data.mobile,
            aadhar: data.aadhar,
        });
    }

    async updateEmployee(id: string, data: any) {
        return employeeRepository.updateEmployee(id, {
            name: data.name,
            image: data.image,
            dob: data.dob || null,
            holidayDemand: data.holidayDemand,
            designation: data.designation,
            gender: data.gender,
            joiningDate: data.joiningDate || null,
            mobile: data.mobile,
            aadhar: data.aadhar,
        });
    }

    async deleteEmployee(id: string) {
        return employeeRepository.deleteEmployee(id);
    }
}