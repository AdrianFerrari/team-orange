import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { ProductI } from "./product";

export type Color = {
    hue: number;
    sat: number;
    light: number;
};

/* export interface StoreI {
    id: number;
    name: string;
    managerId: number;
    apiUrl: string;
    colors: {
        primary: Color;
        secondary: Color;
    };
    products: ProductI[];
    status?: number;
} */

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Store implements StoreI {
    id? = 0;
    name = "";
    managerId = 0;
    apiUrl = "";
    colors? = {
        primary: { hue: 0, sat: 0, light: 0 },
        secondary: { hue: 0, sat: 0, light: 0 },
    };
    products? = [] as ProductI[];
    status? = 1;
}

export interface StoreColorI extends Color {
    id?: number;
    type: string;
    hue: number;
    sat: number;
    light: number;
    storeId: number;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class StoreColor implements StoreColorI {
    id? = 0;
    type = "";
    hue = 0;
    sat = 0;
    light = 0;
    storeId = 0;
}

export interface StoreI {
    /**@IsInt */
    id?: number;
    name: string;
    /**@IsInt */
    managerId: number;
    apiUrl: string;
    status?: number;
    colors?: {
        primary: {
            /**@IsInt */
            hue: number;
            /**@IsInt */
            sat: number;
            /**@IsInt */
            light: number;
        };
        secondary: {
            /**@IsInt */
            hue: number;
            /**@IsInt */
            sat: number;
            /**@IsInt */
            light: number;
        };
    };
    products?: {
        /** @IsInt */
        id?: number;
        name: string;
        description: string;
        price: number;
        discountPercentage: number;
        /** @IsInt */
        currentStock: number;
        /** @IsInt */
        reorderPoint: number;
        /** @IsInt */
        minimum: number;
        /** @IsInt */
        storeId: number;
        categories: string[];
        sizes: string[];
        brand: string;
        url_img: string;
        /** @IsInt */
        status?: number;
    }[];
}
