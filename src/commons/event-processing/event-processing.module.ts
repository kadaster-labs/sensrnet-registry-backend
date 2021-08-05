import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckpointService } from './checkpoint/checkpoint.service';
import { CheckpointSchema } from './checkpoint/checkpoint.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Checkpoint', schema: CheckpointSchema}]),
    ], providers: [
        CheckpointService,
    ], exports: [
        CheckpointService,
    ],
})

export class EventProcessingModule {}
