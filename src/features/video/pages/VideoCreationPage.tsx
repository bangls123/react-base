import { useState } from 'react';
import { Button, Modal } from '@/shared/components';
import ModalCreationPage from './ModalCreationPage';

export const VideoCreationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateVideo = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8">
      <div className="group relative">
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-600 to-indigo-600 opacity-25 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
        <Button
          size="lg"
          className="relative rounded-lg bg-primary-600 px-8 py-6 text-xl font-bold text-white shadow-xl hover:bg-primary-700"
          onClick={handleCreateVideo}
        >
          Tạo video bằng AI
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cấu hình tự động tạo video"
        className="w-full max-w-4xl overflow-hidden p-0"
      >
        <ModalCreationPage onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default VideoCreationPage;
