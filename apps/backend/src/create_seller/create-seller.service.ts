import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSellerEntity } from './entities/create_seller.entity';
import { CreateSellerDto } from './dto/create-seller.dto';

@Injectable()
export class CreateSellerService {
  constructor(
    @InjectRepository(CreateSellerEntity)
    private CreateSellerEntity: Repository<CreateSellerEntity>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.CreateSellerEntity.findAndCount({
      order: { id: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const seller = await this.CreateSellerEntity.findOne({ where: { id } });

    if (!seller) {
      throw new NotFoundException('seller not found');
    }

    return seller;
  }

  async update(id: number, dto: CreateSellerDto) {
    const seller = await this.findOne(id);
    Object.assign(seller, dto);
    await this.CreateSellerEntity.save(seller);
    return { ok: true, message: 'Seller Updated' };
  }

  async remove(id: number) {
    const seller = await this.findOne(id);
    await this.CreateSellerEntity.remove(seller);
    return { message: 'Seller has been deleted' };
  }

  async save(seller: CreateSellerDto): Promise<CreateSellerDto> {
    return this.CreateSellerEntity.save(seller);
  }
}
