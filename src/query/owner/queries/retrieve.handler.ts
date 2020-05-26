import { Owner } from "../models/owner.model"
import { RetrieveOwnersQuery } from './retrieve.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';


@QueryHandler(RetrieveOwnersQuery)
export class RetrieveOwnerQueryHandler implements IQueryHandler<RetrieveOwnersQuery> {
  constructor() {}

  async execute(query: RetrieveOwnersQuery) {
      return await Owner.find({_id: query.id});
  }
}
