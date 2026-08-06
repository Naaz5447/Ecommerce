import crypto from "crypto";
import { EmployeeRepository } from "../repositories/employee.repository";
import { getImageUrl } from "../utils/image-url";

const employeeRepository = new EmployeeRepository();

const parseDate = (value: any): Date | null => {
    if (!value || value === "") return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) { return null; }
    return date;
};

const nullableString = (value: any): string | null => {
    if (value === undefined || value === null) return null;
    const str = String(value).trim();
    return str === "" ? null : str;
};


export class EmployeeService {

    private async generateEmployeeId() {
        const lastEmployee = await employeeRepository.getLastEmployee();
        if (!lastEmployee) {
            return "EMP0001";
        }
        const number = parseInt(
            lastEmployee.employeeId.replace("EMP", ""),
            10
        );
        return `EMP${String(number + 1).padStart(4, "0")}`;
    }

    async getEmployees() {
        const employees = await employeeRepository.getEmployees();
        return employees.map(employee => ({
            ...employee,
            image: getImageUrl(employee.image),
        }));
    }

    async getEmployee(id: string) {
        const employee = await employeeRepository.getEmployeeById(id);
        if (!employee) { return null; }
        return {
            ...employee,
            image: getImageUrl(employee.image),
        };
    }

    async createEmployee(data: any) {
        const employeeId = await this.generateEmployeeId();
        return employeeRepository.createEmployee({
            id: crypto.randomUUID(),
            employeeId,
            name: data.name,
            image: data.image,
            dob: parseDate(data.dob),
            holidayDemand: nullableString(data.holidayDemand),
            designation: nullableString(data.designation),
            gender: data.gender,
            joiningDate: parseDate(data.joiningDate),
            mobile: data.mobile,
            aadhar: nullableString(data.aadhar),
        });
    }


    async updateEmployee(id: string, data: any) {
        const updateData: any = {
            name: data.name,
            dob: parseDate(data.dob),
            holidayDemand: nullableString(data.holidayDemand),
            designation: nullableString(data.designation),
            gender: data.gender || null,
            joiningDate: parseDate(data.joiningDate),
            mobile: data.mobile || "",
            aadhar: nullableString(data.aadhar),
        };
        if (data.image !== undefined) {
            updateData.image = data.image;
        }

        return employeeRepository.updateEmployee(id, updateData);

    }

    async deleteEmployee(id: string) {
        return employeeRepository.deleteEmployee(id);
    }

}
