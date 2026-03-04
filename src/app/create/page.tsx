'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stepper } from '@/components/Stepper';
import type { CargoType, Order } from '@/lib/types';
import { addOrder } from '@/lib/storage';
import { getStep1Errors, Step1Section } from './steps/step1';
import { getStep2Errors, Step2Section } from './steps/step2';
import { buildSummary, getStep3Errors, Step3Section } from './steps/step3';
import type { DraftState, Errors, Step } from './steps/types';

const cities = ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург'] as const;

const defaultDraft: DraftState = {
    name: '',
    phone: '',
    cityFrom: '',
    recipientName: '',
    cityTo: '',
    cargoType: 'regular',
    weightKg: 1,
    agree: false,
};

const fieldClassName =
    'field-control mt-1 w-full rounded-xl px-3 py-2 outline-none';

export default function CreateOrderPage() {
    const router = useRouter();

    const [step, setStep] = useState<Step>(1);
    const [draft, setDraft] = useState(defaultDraft);
    const [errors, setErrors] = useState<Errors>({});

    const summary = useMemo(() => buildSummary(draft), [draft]);

    function setField<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
        setDraft((prev) => ({ ...prev, [key]: value }));
    }

    function clearStepErrors() {
        setErrors({});
    }

    function hasErrors(next: Errors): boolean {
        return Object.keys(next).length > 0;
    }

    function goNext() {
        clearStepErrors();

        if (step === 1) {
            const next = getStep1Errors(draft);
            if (hasErrors(next)) {
                setErrors(next);
                return;
            }
            setStep(2);
            return;
        }

        if (step === 2) {
            const next = getStep2Errors(draft);
            if (hasErrors(next)) {
                setErrors(next);
                return;
            }
            setStep(3);
        }
    }

    function goBack() {
        clearStepErrors();
        setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as Step)));
    }

    function handleSubmit() {
        clearStepErrors();
        const next = getStep3Errors(draft);
        if (hasErrors(next)) {
            setErrors(next);
            return;
        }

        const order: Order = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            status: 'created',
            sender: summary.sender,
            parcel: summary.parcel,
        };

        addOrder(order);
        router.push('/orders');
    }

    function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
        setField('name', e.target.value);
    }
    function onChangePhone(e: React.ChangeEvent<HTMLInputElement>) {
        setField('phone', e.target.value);
    }
    function onChangeCityFrom(e: React.ChangeEvent<HTMLSelectElement>) {
        setField('cityFrom', e.target.value);
    }
    function onChangeRecipientName(e: React.ChangeEvent<HTMLInputElement>) {
        setField('recipientName', e.target.value);
    }
    function onChangeCityTo(e: React.ChangeEvent<HTMLSelectElement>) {
        setField('cityTo', e.target.value);
    }
    function onChangeCargoType(e: React.ChangeEvent<HTMLInputElement>) {
        setField('cargoType', e.target.value as CargoType);
    }
    function onChangeWeight(e: React.ChangeEvent<HTMLInputElement>) {
        setField('weightKg', e.target.value as unknown as number);
    }
    function onToggleAgree(e: React.ChangeEvent<HTMLInputElement>) {
        setField('agree', e.target.checked);
    }

    return (
        <main className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl font-bold">Новая заявка</h1>
                <Link href="/orders" className="text-subtle text-sm hover:underline">
                    История
                </Link>
            </div>

            <Stepper step={step} />

            <div className="card-surface rounded-2xl border p-5 text-zinc-900 shadow-sm">
                {step === 1 ? (
                    <Step1Section
                        draft={draft}
                        errors={errors}
                        cities={cities}
                        fieldClassName={fieldClassName}
                        onChangeName={onChangeName}
                        onChangePhone={onChangePhone}
                        onChangeCityFrom={onChangeCityFrom}
                    />
                ) : null}

                {step === 2 ? (
                    <Step2Section
                        draft={draft}
                        errors={errors}
                        cities={cities}
                        fieldClassName={fieldClassName}
                        onChangeRecipientName={onChangeRecipientName}
                        onChangeCityTo={onChangeCityTo}
                        onChangeCargoType={onChangeCargoType}
                        onChangeWeight={onChangeWeight}
                    />
                ) : null}

                {step === 3 ? (
                    <Step3Section
                        agree={draft.agree}
                        errors={errors}
                        summary={summary}
                        onToggleAgree={onToggleAgree}
                        onSubmit={handleSubmit}
                    />
                ) : null}

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                    <button
                        type="button"
                        className="btn-outline rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
                        onClick={goBack}
                        disabled={step === 1}
                    >
                        Назад
                    </button>

                    {step < 3 ? (
                        <button
                            type="button"
                            className="btn-primary rounded-xl px-4 py-2 text-sm"
                            onClick={goNext}
                        >
                            Далее
                        </button>
                    ) : null}
                </div>
            </div>
        </main>
    );
}
