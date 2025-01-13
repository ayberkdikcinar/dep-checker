import { addMinutes } from 'date-fns';
import { differenceInMilliseconds } from 'date-fns';
import { JobQueueManagerService } from '../services/jobQueueManagerService';
import { appConfig } from '../config/appConfig';

export async function scheduleJob<T>(
  queueName: string,
  data: T,
  delayed: boolean = false,
) {
  const queueServiceInstance = JobQueueManagerService.getInstance();

  if (delayed) {
    const currentDate = new Date();
    const sendTime = addMinutes(
      currentDate,
      appConfig.scheduleTimeIntervalInMinutes,
    );
    const delay = differenceInMilliseconds(sendTime, currentDate);
    await queueServiceInstance.addJobToQueueWithDelay<T>(
      queueName,
      data,
      delay,
    );
  } else {
    await queueServiceInstance.addJobToQueueWithDelay<T>(queueName, data);
  }
}
