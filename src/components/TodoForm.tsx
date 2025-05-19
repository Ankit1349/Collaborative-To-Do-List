import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Priority, Todo } from '../types';
import { useTodoContext } from '../context/TodoContext';

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  todoToEdit?: Todo;
}

export const TodoForm: React.FC<TodoFormProps> = ({ isOpen, onClose, todoToEdit }) => {
  const { addTodo, updateTodo, teamMembers } = useTodoContext();
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);
  const [showKeyboardTips, setShowKeyboardTips] = useState(false);

  // Initialize form when editing an existing todo
  useEffect(() => {
    if (isOpen) {
      if (todoToEdit) {
        setTitle(todoToEdit.title);
        setDescription(todoToEdit.description || '');
        setPriority(todoToEdit.priority);
        setAssigneeId(todoToEdit.assignee?.id);
      } else {
        // Reset form when creating a new todo
        setTitle('');
        setDescription('');
        setPriority('medium');
        setAssigneeId(undefined);
      }

      // Focus title input after a short delay (to allow dialog animation)
      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }, 100);
    }
  }, [todoToEdit, isOpen]);

  // Add keyboard shortcut for form submission (Ctrl+Enter or Cmd+Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && (e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const form = document.getElementById('todo-form') as HTMLFormElement;
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }

      // Show keyboard tips when Alt key is pressed
      if (isOpen && e.altKey) {
        setShowKeyboardTips(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Hide keyboard tips when Alt key is released
      if (isOpen && !e.altKey) {
        setShowKeyboardTips(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (todoToEdit) {
      // Update existing todo
      updateTodo(todoToEdit.id, {
        title,
        description: description || undefined,
        priority,
        assignee: assigneeId ? teamMembers.find(member => member.id === assigneeId) : undefined,
      });
    } else {
      // Add new todo
      addTodo(title, description || undefined, priority, assigneeId);
    }

    onClose();
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Get priority color
  const getPriorityColor = (priorityLevel: Priority) => {
    switch (priorityLevel) {
      case 'high':
        return 'bg-priority-high';
      case 'medium':
        return 'bg-priority-medium';
      case 'low':
        return 'bg-priority-low';
      default:
        return 'bg-gray-400';
    }
  };

  // Get gradient class based on priority
  const getPriorityGradient = (priorityLevel: Priority) => {
    switch (priorityLevel) {
      case 'high':
        return 'bg-gradient-priority-high';
      case 'medium':
        return 'bg-gradient-priority-medium';
      case 'low':
        return 'bg-gradient-priority-low';
      default:
        return 'bg-gradient-to-r from-gray-200 to-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden shadow-smooth-lg">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">{todoToEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>

        <form id="todo-form" onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full flex flex-col items-center">
              <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700 w-full max-w-[300px]">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                ref={titleInputRef}
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full max-w-[300px] rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="w-full flex flex-col items-center">
              <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700 w-full max-w-[300px]">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full max-w-[300px] rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="w-full flex flex-col items-center">
              <label htmlFor="priority" className="block text-sm font-medium mb-1 text-gray-700 w-full max-w-[300px]">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2 w-full max-w-[300px]">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPriority('low')}
                  className={`flex items-center justify-center rounded-xl border px-3 py-2 transition-all ${
                    priority === 'low'
                      ? 'border-green-200 bg-green-50 shadow-sm'
                      : 'border-gray-200 hover:border-green-200 hover:bg-green-50'
                  }`}
                >
                  <div className={`mr-2 h-3 w-3 rounded-full ${getPriorityGradient('low')}`} />
                  <span className={`text-sm ${priority === 'low' ? 'font-medium' : ''}`}>Low</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPriority('medium')}
                  className={`flex items-center justify-center rounded-xl border px-3 py-2 transition-all ${
                    priority === 'medium'
                      ? 'border-yellow-200 bg-yellow-50 shadow-sm'
                      : 'border-gray-200 hover:border-yellow-200 hover:bg-yellow-50'
                  }`}
                >
                  <div className={`mr-2 h-3 w-3 rounded-full ${getPriorityGradient('medium')}`} />
                  <span className={`text-sm ${priority === 'medium' ? 'font-medium' : ''}`}>Medium</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPriority('high')}
                  className={`flex items-center justify-center rounded-xl border px-3 py-2 transition-all ${
                    priority === 'high'
                      ? 'border-red-200 bg-red-50 shadow-sm'
                      : 'border-gray-200 hover:border-red-200 hover:bg-red-50'
                  }`}
                >
                  <div className={`mr-2 h-3 w-3 rounded-full ${getPriorityGradient('high')}`} />
                  <span className={`text-sm ${priority === 'high' ? 'font-medium' : ''}`}>High</span>
                </motion.button>
              </div>
            </div>

            <div className="w-full flex flex-col items-center">
              <label htmlFor="assignee" className="block text-sm font-medium mb-1 text-gray-700 w-full max-w-[300px]">
                Assignee
              </label>
              <Select
                value={assigneeId}
                onValueChange={setAssigneeId}
              >
                <SelectTrigger
                  id="assignee"
                  className="w-full max-w-[300px] border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <SelectValue placeholder="Assign to team member" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="">
                    <div className="flex items-center">
                      <span className="text-gray-500">Unassigned</span>
                    </div>
                  </SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center">
                        <Avatar className="mr-2 h-6 w-6">
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6 flex gap-2 pt-2 border-t border-gray-100">
            {showKeyboardTips && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mr-auto text-xs text-blue-600"
              >
                Press Ctrl+Enter to save
              </motion.div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl"
            >
              {todoToEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
