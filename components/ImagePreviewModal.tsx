import React from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import { PencilIcon } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (imageUrl: string) => void;
  imageUrl: string | null;
}

const ImagePreviewModal: React.FC<Props> = ({ isOpen, onClose, onEdit, imageUrl }) => {
  const { theme } = useMentorX();

  if (!isOpen || !imageUrl) return null;

  const handleEditClick = () => {
    onEdit(imageUrl);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#1F2937] border rounded-xl shadow-2xl w-full max-w-4xl p-4 relative flex flex-col items-center"
        style={{ borderColor: theme.colors.border }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-300 hover:text-white bg-black/30 rounded-full p-1.5 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <img src={imageUrl} alt="AI Generated Preview" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
        
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleEditClick}
            className="px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold hover:opacity-90 transition-colors"
            style={{ backgroundColor: theme.colors.accent, color: theme.colors.accentText }}
          >
            <PencilIcon />
            Edit with this Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
