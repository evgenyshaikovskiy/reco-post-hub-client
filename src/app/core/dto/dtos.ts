import { SubscriptionType } from "../interfaces/user.interface";

export interface CreateSubscriptionDto {
  type: SubscriptionType;
  targetId: string;
}
