import { addHours, addMinutes } from 'date-fns';
import { differenceInMilliseconds } from 'date-fns';
import { ScheduleTimeIntervalHour } from '../lib/constants/scheduleInterval';
import { JobQueueService } from '../services/jobQueueService';

export async function scheduleJob<T>(
  queueName: string,
  data: T,
  delayed: boolean = false,
) {
  const queueServiceInstance = JobQueueService.getInstance();

  if (delayed) {
    const currentDate = new Date();
    const sendTime = addMinutes(currentDate, 5);
    const delay = differenceInMilliseconds(sendTime, currentDate);
    await queueServiceInstance.addJobToQueue<T>(queueName, data, delay);
  } else {
    await queueServiceInstance.addJobToQueue<T>(queueName, data);
  }
}
