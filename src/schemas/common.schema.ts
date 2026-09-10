import { z } from 'zod';

const paramsIdSchema = z.object({
   id: z.string().uuid({ message: 'Invalid ID format' }),
});

const queryPaginationSchema = z.object({
   limit: z.coerce.number().positive().default(10),
   offset: z.coerce.number().nonnegative().default(0),
   sort: z.enum(['ASC', 'DESC']).default('ASC'),
});

type ParamsIdDto = z.infer<typeof paramsIdSchema>;
type QueryPaginationDto = z.infer<typeof queryPaginationSchema>;

export { ParamsIdDto, QueryPaginationDto, paramsIdSchema, queryPaginationSchema };
