import { z } from 'zod';

const phoneRegex =
    /^(\+?\d{1,3})?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

export const step1Schema = z.object({
    name: z.string().trim().min(2, 'Минимум 2 символа'),
    phone: z.string().trim().regex(phoneRegex, 'Некорректный телефон'),
    cityFrom: z.string().trim().min(1, 'Выберите город'),
});

export const step2Schema = z
    .object({
        recipientName: z.string().trim().min(1, 'Обязательное поле'),
        cityTo: z.string().trim().min(1, 'Выберите город'),
        cargoType: z.enum(['documents', 'fragile', 'regular']),
        weightKg: z.coerce.number().min(0.1, 'Мин 0.1').max(30, 'Макс 30'),
    });

export const fullOrderDraftSchema = z
    .object({
        // шаг 1
        name: step1Schema.shape.name,
        phone: step1Schema.shape.phone,
        cityFrom: step1Schema.shape.cityFrom,

        // шаг 2
        recipientName: step2Schema.shape.recipientName,
        cityTo: step2Schema.shape.cityTo,
        cargoType: step2Schema.shape.cargoType,
        weightKg: step2Schema.shape.weightKg,

        // шаг 3
        agree: z.literal(true, { error: 'Нужно согласие' }),
    })
    .superRefine((val, ctx) => {
        if (val.cityFrom.trim().toLowerCase() === val.cityTo.trim().toLowerCase()) {
            ctx.addIssue({
                code: 'custom',
                path: ['cityTo'],
                message: 'Город назначения не может совпадать с городом отправления',
            });
        }
    });

export type OrderDraft = z.infer<typeof fullOrderDraftSchema>;
