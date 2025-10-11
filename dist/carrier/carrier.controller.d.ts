import { CarrierService } from './carrier.service';
export declare class CarrierController {
    private carrierService;
    constructor(carrierService: CarrierService);
    getCarriers(): Promise<import("./carrier.service").CarrierConfig[]>;
    getCarrier(id: string): Promise<import("./carrier.service").CarrierConfig>;
}
