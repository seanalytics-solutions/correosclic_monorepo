import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ComplaintStatus, ComplaintType, ComplaintPriority } from './constants';
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
  constructor(private prisma: PrismaService) {}

  async create(createComplaintDto: CreateComplaintDto) {
    const { profileId, orderId, defectiveProductIds, ...rest } =
      createComplaintDto;

    return this.prisma.complaint.create({
      data: {
        ...rest,
        profile: { connect: { id: profileId } },
        pedido: orderId ? { connect: { id: orderId } } : undefined,
        defectiveProducts:
          defectiveProductIds && defectiveProductIds.length > 0
            ? {
                connect: defectiveProductIds.map((id) => ({ id })),
              }
            : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.complaint.findMany({
      include: {
        profile: true,
        pedido: true,
        defectiveProducts: { include: { producto: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: {
        profile: true,
        pedido: true,
        defectiveProducts: { include: { producto: true } },
      },
    });
    if (!complaint) {
      throw new NotFoundException(`Complaint #${id} not found`);
    }
    return complaint;
  }

  async search(filters: SearchFilters) {
    const where: any = {};

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
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    } else if (filters.startDate) {
      where.createdAt = { gte: new Date(filters.startDate) };
    } else if (filters.endDate) {
      where.createdAt = { lte: new Date(filters.endDate) };
    }

    return this.prisma.complaint.findMany({
      where,
      include: {
        profile: true,
        pedido: true,
        defectiveProducts: { include: { producto: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByProfile(profileId: number) {
    return this.prisma.complaint.findMany({
      where: { profileId: profileId },
      include: {
        profile: true,
        pedido: true,
        defectiveProducts: { include: { producto: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByOrder(orderId: number) {
    return this.prisma.complaint.findMany({
      where: { pedido_id: orderId },
      include: {
        profile: true,
        pedido: true,
        defectiveProducts: { include: { producto: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: ComplaintStatus) {
    return this.prisma.complaint.findMany({
      where: { status },
      include: {
        profile: true,
        pedido: true,
        defectiveProducts: { include: { producto: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByType(type: ComplaintType) {
    return this.prisma.complaint.findMany({
      where: { type },
      include: {
        profile: true,
        pedido: true,
        defectiveProducts: { include: { producto: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPriority(priority: ComplaintPriority) {
    return this.prisma.complaint.findMany({
      where: { priority },
      include: {
        profile: true,
        pedido: true,
        defectiveProducts: { include: { producto: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const total = await this.prisma.complaint.count();
    const pending = await this.prisma.complaint.count({
      where: { status: ComplaintStatus.PENDING },
    });
    const inReview = await this.prisma.complaint.count({
      where: { status: ComplaintStatus.IN_REVIEW },
    });
    const resolved = await this.prisma.complaint.count({
      where: { status: ComplaintStatus.RESOLVED },
    });
    const rejected = await this.prisma.complaint.count({
      where: { status: ComplaintStatus.REJECTED },
    });

    const byType = {
      product_issue: await this.prisma.complaint.count({
        where: { type: ComplaintType.PRODUCT_ISSUE },
      }),
      service_issue: await this.prisma.complaint.count({
        where: { type: ComplaintType.SERVICE_ISSUE },
      }),
      delivery_issue: await this.prisma.complaint.count({
        where: { type: ComplaintType.DELIVERY_ISSUE },
      }),
      other: await this.prisma.complaint.count({
        where: { type: ComplaintType.OTHER },
      }),
    };

    const byPriority = {
      high: await this.prisma.complaint.count({
        where: { priority: ComplaintPriority.HIGH },
      }),
      medium: await this.prisma.complaint.count({
        where: { priority: ComplaintPriority.MEDIUM },
      }),
      low: await this.prisma.complaint.count({
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

  async update(id: number, updateComplaintDto: UpdateComplaintDto) {
    const { defectiveProductIds, ...rest } = updateComplaintDto;

    const complaint = await this.prisma.complaint.findUnique({ where: { id } });
    if (!complaint) throw new NotFoundException(`Complaint #${id} not found`);

    return this.prisma.complaint.update({
      where: { id },
      data: {
        ...rest,
        defectiveProducts:
          defectiveProductIds && defectiveProductIds.length > 0
            ? {
                set: defectiveProductIds.map((id) => ({ id })),
              }
            : undefined,
      },
    });
  }

  async resolve(id: number, updateComplaintDto: UpdateComplaintDto) {
    const complaint = await this.prisma.complaint.findUnique({ where: { id } });
    if (!complaint) throw new NotFoundException(`Complaint #${id} not found`);

    return this.prisma.complaint.update({
      where: { id },
      data: {
        status: ComplaintStatus.RESOLVED,
        ...updateComplaintDto,
      },
    });
  }

  async remove(id: number) {
    const complaint = await this.prisma.complaint.findUnique({ where: { id } });
    if (!complaint) throw new NotFoundException(`Complaint #${id} not found`);
    await this.prisma.complaint.delete({ where: { id } });
  }
}
