import { step2Schema } from '@/lib/orderSchema';
import type { DraftState, Errors } from './types';

type Props = {
    draft: DraftState;
    errors: Errors;
    cities: readonly string[];
    fieldClassName: string;
    onChangeRecipientName: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeCityTo: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onChangeCargoType: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeWeight: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function getStep2Errors(draft: DraftState): Errors {
    const parsed = step2Schema.safeParse({
        recipientName: draft.recipientName,
        cityTo: draft.cityTo,
        cargoType: draft.cargoType,
        weightKg: draft.weightKg,
    });

    const next: Errors = {};

    if (!parsed.success) {
        for (const issue of parsed.error.issues) {
            const key = issue.path[0] as keyof Errors;
            next[key] = issue.message;
        }
    }

    if (
        draft.cityFrom.trim() &&
        draft.cityTo.trim() &&
        draft.cityFrom.trim().toLowerCase() === draft.cityTo.trim().toLowerCase()
    ) {
        next.cityTo = 'Город назначения не может совпадать с городом отправления';
    }

    return next;
}

export function Step2Section({
    draft,
    errors,
    cities,
    fieldClassName,
    onChangeRecipientName,
    onChangeCityTo,
    onChangeCargoType,
    onChangeWeight,
}: Props) {
    return (
        <section className="space-y-4">
            <div>
                <label className="text-sm font-medium">Имя получателя</label>
                <input
                    className={fieldClassName}
                    value={draft.recipientName}
                    onChange={onChangeRecipientName}
                    placeholder="Пётр"
                />
                {errors.recipientName ? <p className="mt-1 text-sm text-red-600">{errors.recipientName}</p> : null}
            </div>

            <div>
                <label className="text-sm font-medium">Город назначения</label>
                <select className={fieldClassName} value={draft.cityTo} onChange={onChangeCityTo}>
                    <option value="">Выберите…</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
                {errors.cityTo ? <p className="mt-1 text-sm text-red-600">{errors.cityTo}</p> : null}
            </div>

            <div>
                <div className="text-sm font-medium">Тип груза</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <label className="flex items-center gap-2 rounded-xl border border-zinc-200 p-3">
                        <input
                            type="radio"
                            name="cargo"
                            value="documents"
                            checked={draft.cargoType === 'documents'}
                            onChange={onChangeCargoType}
                        />
                        <span className="text-sm">Документы</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-zinc-200 p-3">
                        <input
                            type="radio"
                            name="cargo"
                            value="fragile"
                            checked={draft.cargoType === 'fragile'}
                            onChange={onChangeCargoType}
                        />
                        <span className="text-sm">Хрупкое</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-zinc-200 p-3">
                        <input
                            type="radio"
                            name="cargo"
                            value="regular"
                            checked={draft.cargoType === 'regular'}
                            onChange={onChangeCargoType}
                        />
                        <span className="text-sm">Обычное</span>
                    </label>
                </div>
                {errors.cargoType ? <p className="mt-1 text-sm text-red-600">{errors.cargoType}</p> : null}
            </div>

            <div>
                <label className="text-sm font-medium">Вес, кг</label>
                <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="30"
                    className={fieldClassName}
                    value={draft.weightKg}
                    onChange={onChangeWeight}
                />
                {errors.weightKg ? <p className="mt-1 text-sm text-red-600">{errors.weightKg}</p> : null}
            </div>
        </section>
    );
}
