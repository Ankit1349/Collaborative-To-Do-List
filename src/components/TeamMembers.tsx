import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash, Plus, Mail, UserRound } from 'lucide-react';
import { useTodoContext } from '../context/TodoContext';

export const TeamMembers: React.FC = () => {
  const { teamMembers, addTeamMember, deleteTeamMember } = useTodoContext();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) return;

    addTeamMember(name, email, avatarUrl);

    // Reset form
    setName('');
    setEmail('');
    setAvatarUrl('');
    setIsOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border border-gray-100 shadow-smooth h-full bg-white/95">
        <CardHeader className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={() => setIsOpen(true)}
                className="rounded-full shadow-button hover:shadow-button-hover"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Member
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence>
            {teamMembers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center text-gray-500"
              >
                <div className="mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserRound className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium mb-1">No team members yet</h3>
                <p className="text-gray-400 max-w-sm">
                  Add your first team member to start collaborating
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="group"
                  >
                    <div
                      className="flex items-center justify-between rounded-xl border border-gray-100 p-4 bg-white/90 shadow-smooth transition-all hover:shadow-card-hover"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative h-12 w-12"
                          >
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                              <AvatarImage src={member.avatarUrl} alt={member.name} />
                              <AvatarFallback className="text-lg">{getInitials(member.name)}</AvatarFallback>
                            </Avatar>
                          </motion.div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{member.name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="mr-1 h-3 w-3" />
                            {member.email}
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'rgb(254, 226, 226)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteTeamMember(member.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Add Team Member Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden shadow-smooth-lg">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl">Add Team Member</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium mb-1 text-gray-700">
                Avatar URL
              </label>
              <input
                id="avatarUrl"
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter avatar URL (optional)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave blank to use a generated avatar based on email
              </p>
            </div>

            <DialogFooter className="mt-6 flex gap-2 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl"
              >
                Add Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
