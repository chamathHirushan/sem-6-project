import { useState, useEffect } from "react";
import job_post_header_image from '../../assets/job_post_header_image.jpg';

interface PostJobPopupProps {
  open: boolean;
  onClose: () => void;
}

const PostJobPopup: React.FC<PostJobPopupProps> = ({ open, onClose }) => {
  const [selectedType, setSelectedType] = useState<'job' | 'task'>('job');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');

  // Reset form when popup opens
  useEffect(() => {
    if (open) {
      setSelectedType('job');
      setTitle('');
      setDescription('');
      setBudget('');
      setLocation('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    // Optionally reset form or call onClose()
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      {/* Modal background */}
      <div className="bg-white rounded-2xl shadow-lg w-[600px] h-[80vh] relative flex flex-col">
        {/* Header with panoramic image and overlay text */}
        <div className="relative w-full h-32 rounded-t-2xl overflow-hidden">
          <img
            src={job_post_header_image}
            alt="Header"
            className="w-full h-full object-cover bg-[#0f2656]"
          />
          <div className="absolute inset-0 bg-black opacity-40 pointer-events-none" />
          <div
            className="absolute bottom-3 left-4 text-white text-2xl drop-shadow-lg tracking-wider"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Post a new task
          </div>
        </div>

        <button
          className="absolute top-2 right-2 font-medium text-2xl text-gray-800 hover:text-white mr-2"
          onClick={onClose}
        >
          ×
        </button>
        {/* toggle buttons for selecting job or service */}
        {/* <div className="flex justify-center mx-8 my-2">
            <button
                type="button"
                className={`w-full px-4 py-2 rounded-l-sm ${selectedType === 'job' ? 'bg-[#0f2656] text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedType('job')}
                >
                Job Post
            </button>
            <button
                type="button"
                className={`w-full px-4 py-2 rounded-r-sm ${selectedType === 'task' ? 'bg-[#0f2656] text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedType('task')}
                >
                Task Post
            </button>
        </div> */}

        {/* Scrollable Form Area */}
        <div className="overflow-y-auto p-6 flex-1">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="block mb-1 font-medium">
                    {selectedType === 'job' ? 'Job Title' : 'Task Title'}
                    </label>
                    <input
                    className="w-full border rounded px-2 py-1"
                    type="text"
                    placeholder={selectedType === 'job' ? 'Job title' : 'Task title'}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                    className="w-full border rounded px-2 py-1"
                    placeholder="Job description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1 font-medium">Budget</label>
                    <input
                    className="w-full border rounded px-2 py-1"
                    type="number"
                    placeholder="Budget"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1 font-medium">Location</label>
                    <input
                    className="w-full border rounded px-2 py-1"
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    />
                </div>
            </form>
        </div>

        {/* Footer */}
        <div className="border-t rounded-b-2xl px-6 py-3 flex justify-end gap-4 bg-white">
            <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-300 text-gray-800"
                >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                type="submit"
                className="px-6 py-2 rounded-lg bg-primary hover:bg-[#1f3565] text-white"
                >
                Post
            </button>
        </div>
      </div>
    </div>
  );
};

export default PostJobPopup;