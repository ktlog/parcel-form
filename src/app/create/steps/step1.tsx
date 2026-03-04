import { step1Schema } from '@/lib/orderSchema';
import type { DraftState, Errors } from './types';

type Props = {
    draft: DraftState;
    errors: Errors;
    cities: readonly string[];
    fieldClassName: string;
    onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangePhone: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeCityFrom: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function getStep1Errors(draft: DraftState): Errors {
    const parsed = step1Schema.safeParse({
        name: draft.name,
        phone: draft.phone,
        cityFrom: draft.cityFrom,
    });

    if (parsed.success) return {};

    const next: Errors = {};
    for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        next[key] = issue.message;
    }

    return next;
}

export function Step1Section({
    draft,
    errors,
    cities,
    fieldClassName,
    onChangeName,
    onChangePhone,
    onChangeCityFrom,
}: Props) {
    return (
        <section className="space-y-4">
            <div>
                <label className="text-sm font-medium">Имя</label>
                <input
                    className={fieldClassName}
                    value={draft.name}
                    onChange={onChangeName}
                    placeholder="Иван"
                />
                {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
            </div>

            <div>
                <label className="text-sm font-medium">Телефон</label>
                <input
                    className={fieldClassName}
                    value={draft.phone}
                    onChange={onChangePhone}
                    placeholder="+7 999 123-45-67"
                    inputMode="tel"
                />
                {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone}</p> : null}
            </div>

            <div>
                <label className="text-sm font-medium">Город отправления</label>
                <select className={fieldClassName} value={draft.cityFrom} onChange={onChangeCityFrom}>
                    <option value="">Выберите…</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
                {errors.cityFrom ? <p className="mt-1 text-sm text-red-600">{errors.cityFrom}</p> : null}
            </div>
        </section>
    );
}
