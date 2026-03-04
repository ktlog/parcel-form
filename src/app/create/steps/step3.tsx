import { fullOrderDraftSchema } from '@/lib/orderSchema';
import type { DraftState, Errors, Summary } from './types';

type Props = {
    agree: boolean;
    errors: Errors;
    summary: Summary;
    onToggleAgree: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
};

export function buildSummary(draft: DraftState): Summary {
    return {
        sender: {
            name: draft.name,
            phone: draft.phone,
            cityFrom: draft.cityFrom,
        },
        parcel: {
            recipientName: draft.recipientName,
            cityTo: draft.cityTo,
            cargoType: draft.cargoType,
            weightKg: Number(draft.weightKg),
        },
    };
}

export function getStep3Errors(draft: DraftState): Errors {
    const parsed = fullOrderDraftSchema.safeParse({
        ...draft,
        agree: draft.agree ? true : (false as never),
    });

    if (parsed.success) return {};

    const next: Errors = {};
    for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        next[key] = issue.message;
    }

    return next;
}

export function Step3Section({ agree, errors, summary, onToggleAgree, onSubmit }: Props) {
    return (
        <section className="space-y-4">
            <div className="rounded-2xl bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Сводка</div>
                <div className="mt-2 grid gap-3 text-sm text-zinc-700">
                    <div>
                        <div className="text-xs uppercase text-zinc-500">Отправитель</div>
                        <div className="text-zinc-900">{summary.sender.name}</div>
                        <div>{summary.sender.phone}</div>
                        <div>{summary.sender.cityFrom}</div>
                    </div>
                    <div>
                        <div className="text-xs uppercase text-zinc-500">Получатель и посылка</div>
                        <div className="text-zinc-900">{summary.parcel.recipientName}</div>
                        <div>
                            {summary.sender.cityFrom} → {summary.parcel.cityTo}
                        </div>
                        <div>Тип: {summary.parcel.cargoType}</div>
                        <div>Вес: {summary.parcel.weightKg} кг</div>
                    </div>
                </div>
            </div>

            <label className="flex items-start gap-2">
                <input type="checkbox" checked={agree} onChange={onToggleAgree} className="mt-1" />
                <span className="text-sm">
                    Я согласен(на) с условиями доставки
                    {errors.agree ? <span className="block text-red-600">{errors.agree}</span> : null}
                </span>
            </label>

            <button type="button" className="btn-primary w-full rounded-xl px-4 py-2 text-sm" onClick={onSubmit}>
                Отправить
            </button>
        </section>
    );
}
