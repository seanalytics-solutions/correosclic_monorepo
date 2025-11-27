import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  In,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import {
  Complaint,
  ComplaintStatus,
  ComplaintType,
  ComplaintPriority,
} from './entities/complaint.entity';
import { PedidoProducto } from '../pedidos/entities/pedido.entity';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';

interface SearchFilters {
  status?: ComplaintStatus;
  type?: ComplaintType;
  priority?: ComplaintPriority;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintsRepository: Repository<Complaint>,
    @InjectRepository(PedidoProducto)
    private readonly pedidoProductoRepository: Repository<PedidoProducto>,
  ) {}

  async create(createComplaintDto: CreateComplaintDto): Promise<Complaint> {
    const { profileId, orderId, defectiveProductIds, ...rest } =
      createComplaintDto;

    let defectiveProducts: PedidoProducto[] = [];
    if (defectiveProductIds && defectiveProductIds.length > 0) {
      defectiveProducts = await this.pedidoProductoRepository.find({
        where: { id: In(defectiveProductIds) },
      });
    }

    const complaint = this.complaintsRepository.create({
      ...rest,
      profile: { id: profileId },
      pedido: orderId ? { id: orderId } : undefined,
      defectiveProducts,
    });

    return await this.complaintsRepository.save(complaint);
  }

  async findAll(): Promise<Complaint[]> {
    return await this.complaintsRepository.find({
      relations: [
        'profile',
        'pedido',
        'defectiveProducts',
        'defectiveProducts.producto',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Complaint> {
    const complaint = await this.complaintsRepository.findOne({
      where: { id },
      relations: [
        'profile',
        'pedido',
        'defectiveProducts',
        'defectiveProducts.producto',
      ],
    });
    if (!complaint) {
      throw new NotFoundException(`Complaint #${id} not found`);
    }
    return complaint;
  }

  async search(filters: SearchFilters): Promise<Complaint[]> {
    const where: Record<string, unknown> = {};

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }
    if (filters.startDate && filters.endDate) {
      where.createdAt = Between(
        new Date(filters.startDate),
        new Date(filters.endDate),
      );
    } else if (filters.startDate) {
      where.createdAt = MoreThanOrEqual(new Date(filters.startDate));
    } else if (filters.endDate) {
      where.createdAt = LessThanOrEqual(new Date(filters.endDate));
    }

    return await this.complaintsRepository.find({
      where,
      relations: [
        'profile',
        'pedido',
        'defectiveProducts',
        'defectiveProducts.producto',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProfile(profileId: number): Promise<Complaint[]> {
    return await this.complaintsRepository.find({
      where: { profile: { id: profileId } },
      relations: [
        'profile',
        'pedido',
        'defectiveProducts',
        'defectiveProducts.producto',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findByOrder(orderId: number): Promise<Complaint[]> {
    return await this.complaintsRepository.find({
      where: { pedido: { id: orderId } },
      relations: [
        'profile',
        'pedido',
        'defectiveProducts',
        'defectiveProducts.producto',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: ComplaintStatus): Promise<Complaint[]> {
    return await this.complaintsRepository.find({
      where: { status },
      relations: [
        'profile',
        'pedido',
        'defectiveProducts',
        'defectiveProducts.producto',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: ComplaintType): Promise<Complaint[]> {
    return await this.complaintsRepository.find({
      where: { type },
      relations: [
        'profile',
        'pedido',
        'defectiveProducts',
        'defectiveProducts.producto',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPriority(priority: ComplaintPriority): Promise<Complaint[]> {
    return await this.complaintsRepository.find({
      where: { priority },
      relations: [
        'profile',
        'pedido',
        'defectiveProducts',
        'defectiveProducts.producto',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async getStats() {
    const total = await this.complaintsRepository.count();
    const pending = await this.complaintsRepository.count({
      where: { status: ComplaintStatus.PENDING },
    });
    const inReview = await this.complaintsRepository.count({
      where: { status: ComplaintStatus.IN_REVIEW },
    });
    const resolved = await this.complaintsRepository.count({
      where: { status: ComplaintStatus.RESOLVED },
    });
    const rejected = await this.complaintsRepository.count({
      where: { status: ComplaintStatus.REJECTED },
    });

    const byType = {
      product_issue: await this.complaintsRepository.count({
        where: { type: ComplaintType.PRODUCT_ISSUE },
      }),
      service_issue: await this.complaintsRepository.count({
        where: { type: ComplaintType.SERVICE_ISSUE },
      }),
      delivery_issue: await this.complaintsRepository.count({
        where: { type: ComplaintType.DELIVERY_ISSUE },
      }),
      other: await this.complaintsRepository.count({
        where: { type: ComplaintType.OTHER },
      }),
    };

    const byPriority = {
      high: await this.complaintsRepository.count({
        where: { priority: ComplaintPriority.HIGH },
      }),
      medium: await this.complaintsRepository.count({
        where: { priority: ComplaintPriority.MEDIUM },
      }),
      low: await this.complaintsRepository.count({
        where: { priority: ComplaintPriority.LOW },
      }),
    };

    return {
      total,
      byStatus: { pending, inReview, resolved, rejected },
      byType,
      byPriority,
    };
  }

  async update(
    id: number,
    updateComplaintDto: UpdateComplaintDto,
  ): Promise<Complaint> {
    const complaint = await this.findOne(id);
    const { defectiveProductIds, ...rest } = updateComplaintDto;

    if (defectiveProductIds && defectiveProductIds.length > 0) {
      complaint.defectiveProducts = await this.pedidoProductoRepository.find({
        where: { id: In(defectiveProductIds) },
      });
    }

    Object.assign(complaint, rest);
    return await this.complaintsRepository.save(complaint);
  }

  async resolve(
    id: number,
    updateComplaintDto: UpdateComplaintDto,
  ): Promise<Complaint> {
    const complaint = await this.findOne(id);
    complaint.status = ComplaintStatus.RESOLVED;
    Object.assign(complaint, updateComplaintDto);
    return await this.complaintsRepository.save(complaint);
  }

  async remove(id: number): Promise<void> {
    const complaint = await this.findOne(id);
    await this.complaintsRepository.remove(complaint);
  }
}
