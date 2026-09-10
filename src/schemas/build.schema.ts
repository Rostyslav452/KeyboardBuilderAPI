import { z } from 'zod';

const createBuildBodySchema = z.object({
   name: z
      .string()
      .min(3, { message: 'Name too should be at least 3 character' })
      .max(64, { message: ' Name too long' }),
   switchId: z.string().uuid({ message: 'Invalid switch ID format' }),
   caseId: z.string().uuid({ message: 'Invalid case ID format' }),
   pcbId: z.string().uuid({ message: 'Invalid PCB ID format' }),
   keycapId: z.string().uuid({ message: 'Invalid keycap ID format' }),
});

const updateBuildBodySchema = createBuildBodySchema.partial();

type CreateBuildDto = z.infer<typeof createBuildBodySchema>;
type UpdateBuildDto = z.infer<typeof updateBuildBodySchema>;

export { CreateBuildDto, UpdateBuildDto, updateBuildBodySchema, createBuildBodySchema };
