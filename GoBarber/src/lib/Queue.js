import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';
// For each background job we must to create a new queue example: Cancellation, Recover Password.
const jobs = [CancellationMail];
class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    // So here, we define what each job should do.
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, data) {
    /**
     * Every time we call the add method we pass the job as the first parameter
     * and the required data as the second. This method will save the job in the queue
     * and will call the process queue.
     */
    return this.queues[queue].bee.createJob(data).save();
  }

  processQueue() {
    // This method will process each job in real time while other process is running
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      // Bee-queue have some
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}
export default new Queue();
