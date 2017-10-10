/* tslint:disable */

declare var Object: any;
export interface RabbitMQInterface {
  "id"?: any;
}

export class RabbitMQ implements RabbitMQInterface {
  "id": any;
  constructor(data?: RabbitMQInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RabbitMQ`.
   */
  public static getModelName() {
    return "RabbitMQ";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RabbitMQ for dynamic purposes.
  **/
  public static factory(data: RabbitMQInterface): RabbitMQ{
    return new RabbitMQ(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'RabbitMQ',
      plural: 'RabbitMQ',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
