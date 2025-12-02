import { Profile } from '../../profile/entities/profile.entity';

export class Card {
  id: number;

  stripeCardId: string;

  last4: string;

  brand: string;

  profile: Profile;

  profileId: number;
}
