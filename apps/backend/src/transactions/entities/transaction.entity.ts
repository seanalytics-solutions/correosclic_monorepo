import { Product } from '../../products/entities/product.entity';
import { Profile } from '../../profile/entities/profile.entity';

export class Transaction {
  id: number;

  total: number;

  diaTransaccion: Date;

  profile: Profile;

  profileId: number;

  contenidos: TransactionContents[];
}

export class TransactionContents {
  id: number;

  precio: number;

  cantidad: number;

  producto: Product;

  transaction: Transaction;
}
