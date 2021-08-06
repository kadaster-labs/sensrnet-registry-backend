import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckpointSchema } from './checkpoint/checkpoint.schema';
import { CheckpointService } from './checkpoint/checkpoint.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Checkpoint', schema: CheckpointSchema }])],
    providers: [CheckpointService],
    exports: [CheckpointService],
})
export class EventProcessingModule {}
