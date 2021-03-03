import { DeviceEvent } from '../device.event';
import { Category } from '../../../../command/controller/model/category.body';
import { UpdateLocationBody } from '../../../../command/controller/model/location/update-location.body';

export class DeviceUpdated extends DeviceEvent {
  static version = '1';

  readonly legalEntityId: string;
  readonly name: string;
  readonly description: string;
  readonly category: Category;
  readonly connectivity: string;
  readonly location: UpdateLocationBody;

  constructor(deviceId: string, legalEntityId: string, name: string, description: string,
              category: Category, connectivity: string, location: UpdateLocationBody) {
    super(deviceId, DeviceUpdated.version);
    this.legalEntityId = legalEntityId;
    this.name = name;
    this.description = description;
    this.category = category;
    this.connectivity = connectivity;
    this.location = location;
  }
}
