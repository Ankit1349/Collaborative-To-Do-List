import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Filter, CheckCircle, Circle, Clock, X } from 'lucide-react';
import { Priority, Todo } from '../types';
import { useTodoContext } from '../context/TodoContext';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { NewTaskFAB } from './NewTaskFAB';
import { QuickAddTaskInput } from './QuickAddTaskInput';

export const TodoList: React.FC = () => {
  const { todos } = useTodoContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showFABTooltip, setShowFABTooltip] = useState(true);

  // Hide the tooltip after 5 seconds
  useEffect(() => {
    if (showFABTooltip) {
      const timer = setTimeout(() => {
        setShowFABTooltip(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showFABTooltip]);

  const handleEditTodo = (todo: Todo) => {
    setTodoToEdit(todo);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTodoToEdit(undefined);
  };

  const handleNewTaskClick = () => {
    // Show quick add input if not already visible, otherwise show full form
    if (!showQuickAdd) {
      setShowQuickAdd(true);
    } else {
      setIsFormOpen(true);
    }
  };

  const handleTaskAdded = () => {
    // After adding a task with quick add, keep the quick add visible but hide it after a delay
    setTimeout(() => {
      setShowQuickAdd(false);
    }, 3000);
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    // Filter by completion status
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;

    // Filter by priority
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;

    return true;
  });

  // Sort todos by completed status and then by priority
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // Completed items go to the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Sort by priority (high -> medium -> low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <>
      <div className="space-y-6">
        {/* Quick Add Task Input */}
        <AnimatePresence>
          {showQuickAdd && (
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="relative pr-8">
                  <QuickAddTaskInput onTaskAdded={handleTaskAdded} />
                  <button
                    onClick={() => setShowQuickAdd(false)}
                    className="absolute right-0 top-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Progress overview card */}
        <Card className="overflow-hidden rounded-2xl border border-gray-100 shadow-smooth bg-white/95">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Progress Overview</h3>
                <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
              </div>

              <div className="h-2 w-full bg-gray-100 rounded-full mb-4">
                <motion.div
                  className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              <div className="flex justify-between">
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-xl font-semibold">{completedTodos}</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Circle className="h-5 w-5 mr-2 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">In Progress</p>
                    <p className="text-xl font-semibold">{activeTodos}</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-semibold">{totalTodos}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks list card */}
        <Card className="overflow-hidden rounded-2xl border border-gray-100 shadow-smooth bg-white/95">
          <CardHeader className="border-b border-gray-100 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center rounded-full border border-gray-200 bg-white p-1">
                  <motion.button
                    whileHover={{ backgroundColor: filter === 'all' ? '' : 'rgba(0,0,0,0.04)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 text-sm rounded-full transition-all ${
                      filter === 'all'
                        ? 'bg-zinc-900 text-white shadow-button'
                        : 'text-gray-600'
                    }`}
                  >
                    All
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: filter === 'active' ? '' : 'rgba(0,0,0,0.04)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFilter('active')}
                    className={`px-3 py-1 text-sm rounded-full transition-all ${
                      filter === 'active'
                        ? 'bg-zinc-900 text-white shadow-button'
                        : 'text-gray-600'
                    }`}
                  >
                    Active
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: filter === 'completed' ? '' : 'rgba(0,0,0,0.04)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFilter('completed')}
                    className={`px-3 py-1 text-sm rounded-full transition-all ${
                      filter === 'completed'
                        ? 'bg-zinc-900 text-white shadow-button'
                        : 'text-gray-600'
                    }`}
                  >
                    Completed
                  </motion.button>
                </div>

                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
                    className="h-full appearance-none rounded-full border border-gray-200 bg-white pl-9 pr-4 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    onClick={handleNewTaskClick}
                    className="rounded-full shadow-button hover:shadow-button-hover"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    New Task
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence>
              {sortedTodos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center justify-center text-center text-gray-500"
                >
                  <div className="mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                  <p className="text-gray-400 max-w-sm">
                    {filter === 'all' && priorityFilter === 'all'
                      ? 'Get started by creating your first task!'
                      : 'Try changing your filters to see more tasks.'}
                  </p>
                  {(filter !== 'all' || priorityFilter !== 'all') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setFilter('all');
                        setPriorityFilter('all');
                      }}
                      className="mt-4 text-sm text-blue-600 font-medium"
                    >
                      Clear filters
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {sortedTodos.map((todo, index) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onEdit={handleEditTodo}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button */}
      <NewTaskFAB onClick={handleNewTaskClick} showTooltip={showFABTooltip} />

      {/* Task Form Dialog */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        todoToEdit={todoToEdit}
      />
    </>
  );
};
