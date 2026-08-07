import { AreaRepository } from "../repositories/area.repository";


const repository = new AreaRepository();



export class AreaService {



    async createArea(name: string) {


        const existing =
            await repository.findAll();



        const duplicate =
            existing.find(
                area =>
                    area.name.toLowerCase()
                    ===
                    name.toLowerCase()
            );



        if (duplicate) {

            throw new Error(
                "Area already exists"
            );

        }



        return repository.create({
            name
        });


    }




    async getAreas() {

        return repository.findAll();

    }




    async getArea(id: string) {


        const area =
            await repository.findById(id);



        if (!area) {

            throw new Error(
                "Area not found"
            );

        }


        return area;


    }





    async updateArea(
        id: string,
        name: string
    ) {

        return repository.update(
            id,
            {
                name
            }
        );

    }




    async deleteArea(id: string) {

        return repository.delete(id);

    }


}
