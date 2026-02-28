'use client';

import { useState, FormEvent } from 'react';
import { Expense, Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { Input, Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { getTodayString } from '@/lib/utils';

interface Props {
  initial?: Expense;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function ExpenseForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    amount: initial ? String(initial.amount) : '',
    category: initial?.category ?? ('Food & Dining' as Category),
    description: initial?.description ?? '',
    date: initial?.date ?? getTodayString(),
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  function validate() {
    const errs: typeof errors = {};
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) errs.amount = 'Enter a valid positive amount';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      amount: parseFloat(parseFloat(form.amount).toFixed(2)),
      category: form.category,
      description: form.description.trim(),
      date: form.date,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Amount ($)"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="0.00"
        value={form.amount}
        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
        error={errors.amount}
      />
      <Select
        label="Category"
        value={form.category}
        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
        error={errors.category}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </Select>
      <Input
        label="Description"
        type="text"
        placeholder="What did you spend on?"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        error={errors.description}
      />
      <Input
        label="Date"
        type="date"
        value={form.date}
        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        error={errors.date}
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">
          {initial ? 'Save Changes' : 'Add Expense'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
