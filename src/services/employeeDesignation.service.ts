import { EmployeeDesignationRepository } from "../repositories/employeeDesignation.repository";


const repo = new EmployeeDesignationRepository();


export class EmployeeDesignationService {


    async getAll() {

        return repo.getAll();

    }



    async getOne(id: string) {

        return repo.getById(id);

    }



    async create(data: any) {

        return repo.create(data);

    }



    async update(id: string, data: any) {

        return repo.update(id, data);

    }



    async delete(id: string) {

        return repo.delete(id);

    }

}
