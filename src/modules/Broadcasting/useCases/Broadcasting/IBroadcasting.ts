import { Either } from '../../../../core/logic/Either';
import { BroadcastingError } from './Errors/BroadcastingError';

export interface ISend {
  to: string;
  subject: string;
  body: string;
  fromTitle?: string;
}

export type IBroadcastingSenderReturn = Promise<
  Either<BroadcastingError, boolean>
>;

export interface IBroadcastingSender {
  send(sendProps: ISend): IBroadcastingSenderReturn;
}
