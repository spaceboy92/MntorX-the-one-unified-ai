import { useContext } from 'react';
import { MentorXContext } from '../context/NexusAIContext';
import { IMentorXContext } from '../types';

export const useMentorX = (): IMentorXContext => {
  const context = useContext(MentorXContext);
  if (context === undefined) {
    throw new Error('useMentorX must be used within a MentorXProvider');
  }
  return context;
};