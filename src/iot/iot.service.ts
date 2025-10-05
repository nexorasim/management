import { Injectable } from '@nestjs/common';
import { IoTDataPlaneClient, UpdateThingShadowCommand } from '@aws-sdk/client-iot-data-plane';

@Injectable()
export class IoTService {
  private iotClient: IoTDataPlaneClient;

  constructor() {
    this.iotClient = new IoTDataPlaneClient({
      region: 'us-east-1',
      endpoint: 'https://a1t1uoy03yaopf-ats.iot.us-east-1.amazonaws.com',
    });
  }

  async updateProfileShadow(profileId: string, status: string) {
    const payload = {
      state: {
        reported: {
          NexoraSIM: {
            version: 1,
            profileId,
            status,
            timestamp: Date.now(),
          }
        }
      }
    };

    const command = new UpdateThingShadowCommand({
      thingName: `nexorasim-profile-${profileId}`,
      payload: JSON.stringify(payload),
    });

    return this.iotClient.send(command);
  }
}