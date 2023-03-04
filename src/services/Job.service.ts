import Bull, {JobOptions, ProcessCallbackFunction, Queue, QueueOptions} from "bull";
import {LoggerService} from "mein-winston-logger";

interface IQueueOptions {
    name: string,
    queueConfig: QueueOptions
}

interface IJob {
    name: string,
    data: any,
    opts: JobOptions
}

//An interface above Bull queue instance for a repeating job
export class JobService {
  queueOpts: IQueueOptions
  queue: Queue
  //stores last assigned job
  job: IJob
  logger: LoggerService

  //create Queue
  constructor(initOpts: IQueueOptions, options: { logger: LoggerService }) {
    this.queueOpts = initOpts
    //dependencies
    this.logger = options.logger
  }

  //check that bull is ready for operation , assign a job to service
  async init() {
    //create queue instance
    this.queue = new Bull(this.queueOpts.name, this.queueOpts.queueConfig)
    //check that queue has connected to Redis and jobs can be added
    return this.queue.isReady()
  }

  //add job to Queue
  async push(job: IJob) {
    this.job = job
    this.logger.app.info('Added job ', this.job)
    await this.queue.add(this.job.name, this.job.data, this.job.opts)
  }

  //register
  async process(func: ProcessCallbackFunction<any>, concurrency?: number, name?: string) {
    const name_ = name || this.job?.name
    //register processes for a job with name provided, or for a job assigned to instance if no name was provided
    if (!name_) {
      this.queue.process(concurrency || 1, func)
    } else {
      this.queue.process(name_, concurrency || 1, func)
    }
    this.logger.app.info('Registered consumer', {name: func.name})
  }
}