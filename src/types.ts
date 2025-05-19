// Define the priority levels for tasks
export type Priority = 'low' | 'medium' | 'high';

// Define a team member
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// Define a todo item
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  assignee?: TeamMember;
  createdAt: Date;
  updatedAt: Date;
}
