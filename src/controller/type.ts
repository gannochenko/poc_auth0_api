import { InputContext as MVCInputContext } from '@gannochenko/express.mvc';

export interface CustomContext {}
export type Context = MVCInputContext<CustomContext>;
