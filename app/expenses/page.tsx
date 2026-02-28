'use client';

import { useState } from 'react';
import { Expense, ExpenseFilters } from '@/lib/types';
import { useExpenses, filterExpenses } from '@/lib/useExpenses';
import ExpenseFilterBar from '@/components/expenses/ExpenseFilters';
import ExpenseList from '@/components/expenses/ExpenseList';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

const defaultFilters: ExpenseFilters = {
  category: 'All',
  dateFrom: '',
  dateTo: '',
  search: '',
};

export default function ExpensesPage() {
  const { expenses, loaded, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [filters, setFilters] = useState<ExpenseFilters>(defaultFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const filtered = filterExpenses(expenses, filters);

  function handleOpenAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function handleOpenEdit(e: Expense) {
    setEditing(e);
    setModalOpen(true);
  }

  function handleSubmit(data: Omit<Expense, 'id' | 'createdAt'>) {
    if (editing) {
      updateExpense(editing.id, data);
    } else {
      addExpense(data);
    }
    setModalOpen(false);
    setEditing(null);
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filtered.length} of {expenses.length} expenses
        </p>
        <Button onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <ExpenseFilterBar filters={filters} onChange={setFilters} />

      {/* List */}
      <ExpenseList
        expenses={filtered}
        onEdit={handleOpenEdit}
        onDelete={deleteExpense}
      />

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Expense' : 'Add New Expense'}
      >
        <ExpenseForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
        />
      </Modal>
    </div>
  );
}
