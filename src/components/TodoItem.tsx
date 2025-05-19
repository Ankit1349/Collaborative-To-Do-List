import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash, Edit, User, Calendar } from 'lucide-react';
import { Todo } from '../types';
import { useTodoContext } from '../context/TodoContext';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  index: number;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, index }) => {
  const { toggleTodoCompletion, deleteTodo, getPriorityColor } = useTodoContext();

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Get gradient class based on priority
  const getPriorityGradient = (priority: string) => {
    switch (priority) {
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="mb-3"
    >
      <Card className="backdrop-blur-sm bg-white/95 overflow-hidden rounded-2xl border border-gray-100 shadow-smooth transition-all hover:shadow-card-hover">
        <div className="relative">
          <div
            className={`absolute top-0 left-0 h-full w-2 ${getPriorityGradient(todo.priority)}`}
            title={`Priority: ${todo.priority}`}
          />
          <div className="p-5 pl-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-start space-x-3">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="mt-1"
                >
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodoCompletion(todo.id)}
                    className="border-2 h-5 w-5"
                  />
                </motion.div>

                <div className="flex-1">
                  <motion.div
                    layout
                    className="flex items-center"
                  >
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`flex-1 text-lg font-medium transition-all ${
                        todo.completed
                          ? 'text-gray-400 line-through'
                          : 'text-gray-800'
                      }`}
                    >
                      {todo.title}
                    </label>
                  </motion.div>

                  {todo.description && (
                    <motion.p
                      layout
                      className={`mt-1 text-sm ${
                        todo.completed
                          ? 'text-gray-400 line-through'
                          : 'text-gray-500'
                      }`}
                    >
                      {todo.description}
                    </motion.p>
                  )}

                  <motion.div layout className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {todo.assignee ? (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center bg-gray-50 px-3 py-1 rounded-full"
                          title={`Assigned to: ${todo.assignee.name}`}
                        >
                          <Avatar className="h-6 w-6 mr-2 border border-white">
                            <AvatarImage src={todo.assignee.avatarUrl} alt={todo.assignee.name} />
                            <AvatarFallback>{getInitials(todo.assignee.name)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{todo.assignee.name}</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center text-gray-400 bg-gray-50 px-3 py-1 rounded-full"
                        >
                          <User className="h-4 w-4 mr-1" />
                          <span className="text-sm">Unassigned</span>
                        </motion.div>
                      )}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center text-gray-400 bg-gray-50 px-3 py-1 rounded-full"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-xs">
                        {new Date(todo.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                  >
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-smooth-lg">
                  <DropdownMenuItem
                    onClick={() => onEdit(todo)}
                    className="rounded-lg cursor-pointer flex items-center px-3 py-2 transition-all"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteTodo(todo.id)}
                    className="rounded-lg cursor-pointer text-red-600 flex items-center px-3 py-2 hover:bg-red-50 transition-all"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
