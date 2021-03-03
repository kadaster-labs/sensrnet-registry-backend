import { DeviceEvent } from '../device.event';
import { Category } from '../../../../command/controller/model/category.body';
import { RegisterLocationBody } from '../../../../command/controller/model/location/register-location.body';

export class DeviceRegistered extends DeviceEvent {
  static version = '1';

  readonly legalEntityId: string;
  readonly name: string;
  readonly description: string;
  readonly category: Category;
  readonly connectivity: string;
  readonly location: RegisterLocationBody;

  constructor(deviceId: string, legalEntityId: string, name: string, description: string,
              category: Category, connectivity: string, location: RegisterLocationBody) {
    super(deviceId, DeviceRegistered.version);

    this.legalEntityId = legalEntityId;
    this.name = name;
    this.description = description;
    this.category = category;
    this.connectivity = connectivity;
    this.location = location;
  }
}
