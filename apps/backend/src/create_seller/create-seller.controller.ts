import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateSellerService } from './create-seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sellers')
@Controller('sellers')
export class CreateSellerController {
  constructor(private readonly createSellerService: CreateSellerService) {}

  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.createSellerService.save(createSellerDto);
  }

  @Get()
  findAll() {
    return this.createSellerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.createSellerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createSellerDto: CreateSellerDto) {
    return this.createSellerService.update(+id, createSellerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.createSellerService.remove(+id);
  }
}
