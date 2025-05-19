import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Priority, TeamMember } from '../types';
import { useTodoContext } from '../context/TodoContext';

interface QuickAddTaskInputProps {
  onTaskAdded: () => void;
}

export const QuickAddTaskInput: React.FC<QuickAddTaskInputProps> = ({ onTaskAdded }) => {
  const { addTodo, teamMembers } = useTodoContext();
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [openMemberPicker, setOpenMemberPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Find the selected team member
  const selectedMember = selectedMemberId
    ? teamMembers.find(member => member.id === selectedMemberId)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle.trim()) return;

    // Extract priority from title if using hashtags #high, #medium, #low
    let priority: Priority = 'medium';
    let finalTitle = taskTitle;

    if (taskTitle.includes('#high')) {
      priority = 'high';
      finalTitle = taskTitle.replace('#high', '').trim();
    } else if (taskTitle.includes('#medium')) {
      priority = 'medium';
      finalTitle = taskTitle.replace('#medium', '').trim();
    } else if (taskTitle.includes('#low')) {
      priority = 'low';
      finalTitle = taskTitle.replace('#low', '').trim();
    }

    // Add the task with the selected assignee if any
    addTodo(
      finalTitle,
      undefined,
      priority,
      selectedMemberId || undefined
    );

    // Reset the form
    setTaskTitle('');
    setSelectedMemberId(null);
    onTaskAdded();
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="relative mb-6"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Type a task and press Enter (use #high, #medium, or #low for priority)"
              className="h-10 w-full max-w-[800px] rounded-xl border border-gray-200 bg-white/95 px-4 py-3 pl-4 pr-4 text-base shadow-sm transition-all "
            />
          </div>

          <Popover open={openMemberPicker} onOpenChange={setOpenMemberPicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openMemberPicker}
                className="h-9 rounded-xl border-gray-200 min-w-[170px] justify-between rounded-xl px-4 py-4 pl-4 pr-4 shadow-sm transition-all"
                type="button"
              >
                {selectedMember ? (
                  <div className="flex items-center justify-start gap-2 overflow-hidden">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedMember.avatarUrl} alt={selectedMember.name} />
                      <AvatarFallback>{getInitials(selectedMember.name)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{selectedMember.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <User className="h-4 w-4" />
                    <span>Assign to</span>
                  </div>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0" align="end">
              <Command>
                <CommandInput placeholder="Search member..." />
                <CommandEmpty>No team member found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {teamMembers.map((member) => (
                    <CommandItem
                      key={member.id}
                      onSelect={() => {
                        setSelectedMemberId(member.id);
                        setOpenMemberPicker(false);
                      }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                      {selectedMemberId === member.id && (
                        <Check className="ml-auto h-4 w-4 text-green-500" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Button
            type="submit"
            className="h-10 rounded-xl px-4"
            disabled={!taskTitle.trim()}
          >
            Add
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {isInputFocused && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-2 text-xs text-gray-500"
          >
            <span className="font-medium">Pro tips:</span> Add priority tags like #high, #medium, or #low at the end of your task. Assign team members using the dropdown.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
