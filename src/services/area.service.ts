import { AreaRepository } from "../repositories/area.repository";

const repository = new AreaRepository();

export class AreaService {
    async createArea(
        shopId: string,
        name: string
    ) {
        const trimmedName = name.trim();

        if (!trimmedName) {
            throw new Error("Area name is required");
        }

        const existing =
            await repository.findByName(
                shopId,
                trimmedName
            );

        if (existing) {
            throw new Error(
                "Area already exists"
            );
        }

        return repository.create(
            shopId,
            trimmedName
        );
    }

    async getAreas(shopId: string) {
        return repository.findAll(shopId);
    }

    async getArea(
        id: string,
        shopId: string
    ) {
        const area =
            await repository.findById(
                id,
                shopId
            );

        if (!area) {
            throw new Error(
                "Area not found"
            );
        }

        return area;
    }

    async updateArea(
        id: string,
        shopId: string,
        name: string
    ) {
        const trimmedName = name.trim();

        if (!trimmedName) {
            throw new Error(
                "Area name is required"
            );
        }

        const area =
            await repository.findById(
                id,
                shopId
            );

        if (!area) {
            throw new Error(
                "Area not found"
            );
        }

        const duplicate =
            await repository.findByName(
                shopId,
                trimmedName
            );

        if (
            duplicate &&
            duplicate.id !== id
        ) {
            throw new Error(
                "Area already exists"
            );
        }

        const result =
            await repository.update(
                id,
                shopId,
                trimmedName
            );

        if (result.count === 0) {
            throw new Error(
                "Area not found"
            );
        }

        return repository.findById(
            id,
            shopId
        );
    }

    async deleteArea(
        id: string,
        shopId: string
    ) {
        const area =
            await repository.findById(
                id,
                shopId
            );

        if (!area) {
            throw new Error(
                "Area not found"
            );
        }

        try {
            return await repository.delete(
                id,
                shopId
            );
        } catch (error: any) {
            /*
             * An Area may already be referenced
             * by customers.
             */
            if (
                error?.code === "P2003"
            ) {
                throw new Error(
                    "Cannot delete area because customers are using it"
                );
            }

            throw error;
        }
    }
}
