import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckpointService } from './checkpoint.service';
import { CheckpointSchema } from './models/checkpoint.model';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Checkpoint', schema: CheckpointSchema}]),
    ],
    providers: [
        CheckpointService,
    ],
    exports: [CheckpointService],
})

export class CheckpointModule {}
