import { Button } from '@components/ui';

export const VideoCreationPage = () => {
  const handleCreateVideo = () => {
    alert('Bắt đầu quá trình tạo video bằng AI...');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Sáng tạo Video với <span className="text-primary-600">AI</span>
        </h1>
        <p className="max-w-2xl text-lg text-gray-500">
          Sử dụng trí tuệ nhân tạo để tạo ra những video chuyên nghiệp chỉ trong vài giây.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <Button 
          size="lg" 
          className="relative px-8 py-6 text-xl font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-xl"
          onClick={handleCreateVideo}
        >
          Tạo video bằng AI
        </Button>
      </div>
    </div>
  );
};

export default VideoCreationPage;
