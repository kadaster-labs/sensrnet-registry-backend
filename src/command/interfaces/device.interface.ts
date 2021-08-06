import { Category } from '../model/category.model';
import Location from './location.interface';

export default interface Device {
    deviceId: string;
    name?: string;
    description?: string;
    category?: Category;
    connectivity?: string;
    location?: Location;
}
