import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Priority, TeamMember, Todo } from '../types';

// Sample team members for demonstration
const defaultTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=john@example.com',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=jane@example.com',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=bob@example.com',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=alice@example.com',
  },
];

// Sample initial todos for demonstration
const defaultTodos: Todo[] = [
  {
    id: uuidv4(),
    title: 'Create project plan',
    description: 'Outline the project milestones and deliverables',
    completed: false,
    priority: 'high',
    assignee: defaultTeamMembers[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: 'Design mockups',
    description: 'Create UI/UX designs for the application',
    completed: true,
    priority: 'medium',
    assignee: defaultTeamMembers[1],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: 'Backend implementation',
    description: 'Develop the API endpoints and database schema',
    completed: false,
    priority: 'high',
    assignee: defaultTeamMembers[2],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface TodoContextType {
  todos: Todo[];
  teamMembers: TeamMember[];
  addTodo: (title: string, description?: string, priority?: Priority, assigneeId?: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompletion: (id: string) => void;
  updateTodo: (id: string, updatedTodo: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  addTeamMember: (name: string, email: string, avatarUrl?: string) => void;
  deleteTeamMember: (id: string) => void;
  getPriorityColor: (priority: Priority) => string;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from localStorage on initial render
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        // Parse stored todos and convert string dates back to Date objects
        const parsedTodos = JSON.parse(storedTodos);
        return parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        }));
      } catch (error) {
        console.error('Failed to parse todos from localStorage', error);
        return defaultTodos;
      }
    }
    return defaultTodos;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const storedMembers = localStorage.getItem('teamMembers');
    if (storedMembers) {
      try {
        return JSON.parse(storedMembers);
      } catch (error) {
        console.error('Failed to parse team members from localStorage', error);
        return defaultTeamMembers;
      }
    }
    return defaultTeamMembers;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Add a new todo
  const addTodo = (title: string, description?: string, priority: Priority = 'medium', assigneeId?: string) => {
    const assignee = assigneeId ? teamMembers.find(member => member.id === assigneeId) : undefined;

    const newTodo: Todo = {
      id: uuidv4(),
      title,
      description,
      completed: false,
      priority,
      assignee,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  // Toggle todo completion status
  const toggleTodoCompletion = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  };

  // Update a todo
  const updateTodo = (id: string, updatedTodo: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              ...updatedTodo,
              assignee: updatedTodo.assignee ||
                (updatedTodo.assignee === null ? undefined : todo.assignee),
              updatedAt: new Date(),
            }
          : todo
      )
    );
  };

  // Add a team member
  const addTeamMember = (name: string, email: string, avatarUrl?: string) => {
    const newMember: TeamMember = {
      id: uuidv4(),
      name,
      email,
      avatarUrl: avatarUrl || `https://img.freepik.com/premium-photo/color-user-icon-white-background_961147-8.jpg?w=1380`,
    };

    setTeamMembers(prevMembers => [...prevMembers, newMember]);
  };

  // Delete a team member
  const deleteTeamMember = (id: string) => {
    setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== id));

    // Also update any todos that were assigned to this member
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.assignee?.id === id
          ? { ...todo, assignee: undefined, updatedAt: new Date() }
          : todo
      )
    );
  };

  // Get color for priority
  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        teamMembers,
        addTodo,
        deleteTodo,
        toggleTodoCompletion,
        updateTodo,
        addTeamMember,
        deleteTeamMember,
        getPriorityColor,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};
