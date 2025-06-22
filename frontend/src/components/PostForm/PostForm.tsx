import { useState, useEffect } from "react";
import job_post_header_image from '../../assets/job_post_header_image.jpg';
import { Country, City } from "country-state-city";
import type { ICountry, ICity } from "country-state-city";
import { handleImageUpload as uploadToCloudinary } from '../../utils/Cloudinary';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { X } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import {addService, addJob} from '../../api/userAPI'; // Adjust the import path as necessary
import { toast } from "react-toastify";


interface PostJobPopupProps {
  open: boolean;
  onClose: () => void;
}

const PostJobPopup: React.FC<PostJobPopupProps> = ({ open, onClose }) => {
  const [selectedType, setSelectedType] = useState<'job' | 'task'>('job');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [miniDescription, setMiniDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [jobType, setJobType] = useState<'Full Time' | 'Part Time'>('Full Time');
  const [urgent, setUrgent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [postedDate, setPostedDate] = useState<Date | null>(null);
  const [image, setImage] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<number>(0);
  const [poster, setPoster] = useState<{ name: string, previewUrl: string, isImage: boolean } | null>(null);

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [boostLevel, setBoostType] = useState(0);
  const [premium, setPremium] = useState<boolean>(false);


  // Load all countries on mount
useEffect(() => {
  const initialize = () => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);

    const prem = localStorage.getItem("premium");
    setPremium(prem === "true");

    console.log("premium status:", prem);
  };

  // ✅ Initial run
  initialize();

  // ✅ Set up event listener to allow external triggering
  window.addEventListener("trigger-initialize", initialize);

  // ✅ Clean up
  return () => {
    window.removeEventListener("trigger-initialize", initialize);
  };
}, []);


  // Load initial data when the component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      const countryList = Country.getAllCountries();
      setCountries(countryList);
  
      // Simulate any other async data loading here (e.g., images, etc.)
      await new Promise(resolve => setTimeout(resolve, 500)); // optional artificial delay
  
      setLoading(false);
    };
  
    loadInitialData();
  }, []);
  

  // Load cities whenever a country is selected
  useEffect(() => {
    if (selectedCountry) {
      const cityList = City.getCitiesOfCountry(selectedCountry) || [];
      setCities(cityList);
    }
  }, [selectedCountry]);

  // Update the location string
  useEffect(() => {
    if (selectedCountry && selectedCity) {
      const countryName = countries.find(c => c.isoCode === selectedCountry)?.name || "";
      setLocation(`${countryName}, ${selectedCity}`);
    }
  }, [selectedCountry, selectedCity, countries]);

  // Update the posted date to current date when form opens
  useEffect(() => {
    if (open) {
      setPostedDate(new Date());
    }
  }, [open]);

    const boostTypes = [
    { label: "Standard Boost", value: 1 },
    { label: "Premium Boost", value: 2 },
  ];
  
  // Reset form when popup opens
  useEffect(() => {
    if (open) {
      setSelectedType('job');
      setTitle('');
      setDescription('');
      setMiniDescription('');
      setBudget('');
      setLocation('');
      setAddress('');
      setJobType('Full Time');
      setUrgent(false);
      setSelectedCategory('');
      setSelectedSubCategory('');
      setDueDate(null);
      setPostedDate(new Date());
      setImage([]);
      setPoster(null);
      setBoostType(0);
      setSelectedCountry('');
      setSelectedCity('');
      setCities([]);
      setCountries(Country.getAllCountries());
    }else{
      // Clean up on close
      setImage([]);
      setUploadingImages(0);
      setPoster(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    // Optionally reset form or call onClose()
    if (selectedType === 'job'){
      // console.log("Job Post Submitted:", {
      //   title,
      //   description,
      //   miniDescription,
      //   budget,
      //   location,
      //   urgent,
      //   selectedCategory,
      //   selectedSubCategory,
      //   dueDate,
      //   postedDate,
      //   images: image,
      //   poster,
      //   boostLevel
      // });
      window.dispatchEvent(new Event("add"));

      // await addJob(
      //   {
      //     "title": title,
      //     "description": description,
      //     "mini_description": miniDescription,
      //     "budget": budget ? parseFloat(budget) : null,
      //     "location": location,
      //     "urgent": urgent,
      //     "category": selectedCategory,
      //     "subcategory": selectedSubCategory,
      //     "due_date": dueDate ? dueDate.toISOString() : null,
      //     "posted_date": postedDate ? postedDate.toISOString() : null,
      //     "images": image,
      //     "poster": poster || null,
      //     "boost_level": boostLevel
      //   }
      // );
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a delay for the service post creation
      toast.success("task Post Created Successfully!");
      
    }else{
      // console.log("Service Post Submitted:", {
      //   title,
      //   description,
      //   miniDescription,
      //   location,
      //   selectedCategory,
      //   selectedSubCategory,
      //   dueDate,
      //   postedDate,
      //   images: image,
      //   poster
      // });
      // await addService(
      //   {
      //     "title": title,
      //     "description": description,
      //     "mini_description": miniDescription,
      //     "location": location,
      //     "category": selectedCategory,
      //     "subcategory": selectedSubCategory,
      //     "due_date": dueDate ? dueDate.toISOString() : null,
      //     "posted_date": postedDate ? postedDate.toISOString() : null,
      //     "images": image,
      //     "poster": poster || null
      //   }
      // )
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a delay for the service post creation
      toast.success("Service Post Created Successfully!");
    }
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    try {
      const urls = await uploadToCloudinary(files);
      setImage(urls); // save the array of image URLs to state
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  

  
  const menuItems = [
    { label: "Technicians", subItems: [
      "AC Repairs", "CCTV", "Constructions", "Electricians", "Electronic Repairs", "Glass & Aluminium", "Iron Works",
      "Masonry", "Odd Jobs", "Pest Controllers", "Plumbing", "Wood Works"
    ]},
    { label: "Vehicles", subItems: [
      "Auto Mechanic", "Car Wash", "Delivery", "Drivers", "Spare Parts", "Transport", "Vehicle Rental"
    ]},
    { label: "IT", subItems: [
      "Computer Repairs", "Data Entry", "Design & Creative", "Phone Repairs", "Telecommunication", "Web, Mobile & Software"
    ]},
    { label: "Professional", subItems: [
      "Accountancy", "Arts & Crafts", "Hotels & Hospitality", "IT Consultancy", "Insurance Agents", "Legal Advice",
      "Loan Brokers", "Modeling", "Security", "Travel Agents", "Tuition"
    ]},
    { label: "Personalised Services", subItems: [
      "Caretaker / Home Nurse", "Caretakers", "Fitness Training", "Housemaids", "Sports"
    ]},
    { label: "Printing", subItems: [   
      "Printing", "T Shirts & Caps", "Type Setting"
    ]},
    { label: "House", subItems: [
      "Architects", "Boarding Places", "House Painting", "House Rental", "House/Office Cleaning", "Interior Design", "Landscaping"
    ]},
    { label: "Beauty & Event", subItems: [
      "Advertising & promotions", "Audio Hires", "Band, DJ & dancing", "Band, DJ & dancing", "Beauty Salon", "Catering & Food",
      "Dress Makers","Event Planners", "Flowers & Decos", "Health & Beauty Spa", "Photography", "Videography"] },
    { label: "Other", subItems: ["Other"] },
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-2xl shadow-lg w-[500px] h-[80vh] flex flex-col items-center justify-center">
          {/* Spinner */}
          <div className="flex flex-col items-center justify-center h-full">
            <svg className="animate-spin h-10 w-10 text-cyan-700 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="text-cyan-800 text-lg font-semibold">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      {/* Modal background */}
      <div className="bg-white rounded-2xl shadow-lg w-[500px] h-[80vh] relative flex flex-col">
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
            Create Your Post Today...
          </div>
        </div>

        <button
          className="absolute top-2 right-2 font-medium text-2xl text-gray-800 hover:text-white mr-2"
          onClick={onClose}
        >
          ×
        </button>
        {/* toggle buttons for selecting job or service */}
        {premium && (
        <div className="flex justify-center mx-8 my-2">
            <button
                type="button"
                className={`w-full px-4 py-2 rounded-l-sm ${selectedType === 'job' ? 'bg-[#0f2656] text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedType('job')}
                >
                Task Post
            </button>
            <button
                type="button"
                className={`w-full px-4 py-2 rounded-r-sm ${selectedType === 'task' ? 'bg-[#0f2656] text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedType('task')}
                >
                Service Post
            </button>
        </div>)}

        {/* Scrollable Form Area */}
        <div className="overflow-y-auto pt-2 p-6 flex-1">
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-3">
                    <label className="block mb-1 font-medium">
                    {selectedType === 'job' ? 'Job Title' : 'Service Title'}
                    </label>
                    <input
                    className="w-full border rounded px-2 py-1"
                    type="text"
                    placeholder={selectedType === 'job' ? 'Job title' : 'Service title'}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    />
                </div>

                {  /* Short Description */}
                <div className="mb-3">
                    <label className="block mb-1 font-medium">
                    {selectedType === 'job' ? 'Short Description' : 'Service Description'}
                    </label>
                    <input
                    className="w-full border rounded px-2 py-1"
                    type="text"
                    placeholder={selectedType === 'job' ? 'Short job description' : 'Short service description'}
                    value={miniDescription}
                    onChange={e => setMiniDescription(e.target.value)}
                    />
                </div>

                {/* Long Description */}
                <div className="mb-3">
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                    className="w-full border rounded px-2 py-1"
                    placeholder="Long description here..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    />
                </div>
                
                {/* Budget*/}
                {selectedType === 'job' && (
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
                )}

               {/* Location */}
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Location</label>

                  <div className="flex gap-2">
                    {/* Country Select */}
                    <div className="w-1/2">
                      <Select
                        options={countries.map(c => ({ value: c.isoCode, label: c.name }))}
                        value={countries.find(c => c.isoCode === selectedCountry) && {
                          value: selectedCountry,
                          label: countries.find(c => c.isoCode === selectedCountry)?.name,
                        }}
                        onChange={(selectedOption) => {
                          setSelectedCountry(selectedOption?.value || "");
                          setSelectedCity("");
                          setLocation("");
                        }}
                        placeholder="Select Country"
                        isClearable
                      />
                    </div>

                    {/* City Select */}
                    <div className="w-1/2">
                      <Select
                        options={cities.map(city => ({ value: city.name, label: city.name }))}
                        value={selectedCity ? { value: selectedCity, label: selectedCity } : null}
                        onChange={(selectedOption) => {
                          const cityName = selectedOption?.value || "";
                          setSelectedCity(cityName);

                          const countryName = countries.find(c => c.isoCode === selectedCountry)?.name || "";
                          setLocation(`${countryName}, ${cityName}`);
                        }}
                        placeholder="Select City"
                        isDisabled={!cities.length}
                        isClearable
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                {/* <div className="mb-3">
                    <label className="block mb-1 font-medium">Address</label>
                    <input
                    className="w-full border rounded px-2 py-1"
                    type="text"
                    placeholder="Location"
                    value={address}
                    onChange={e => setLocation(e.target.value)}
                    />
                </div> */}

                {/* Job Type - Full time/ Part time*/}
                {/* {selectedType === 'job' && (
                  <div className="mb-3">
                    <label className="block mb-1 font-medium">Job Type</label>
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={jobType}
                      onChange={e => setJobType(e.target.value as 'Full Time' | 'Part Time')}
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                    </select>
                  </div>
                )} */}

                {/* Category Selection */}
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Category</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={selectedCategory}
                    onChange={e => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubCategory('');
                    }}
                  >
                    <option value="">Select Category</option>
                    {menuItems.map((item, index) => (
                      <option key={index} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory Selection */}
                {selectedCategory && (
                  <div className="mb-3">
                  <label className="block mb-1 font-medium">Subcategory</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={selectedSubCategory}
                    onChange={e => setSelectedSubCategory(e.target.value)}
                  >
                    <option value="">Select Subcategory</option>
                    {menuItems
                    .find(item => item.label === selectedCategory)
                    ?.subItems.map((sub, idx) => (
                      <option key={idx} value={sub}>
                      {sub}
                      </option>
                    ))}
                  </select>
                  </div>
                )}

                {/* Due date selection calander */}
                {selectedType === 'job' && (
                  <div className="mb-3">
                    <label className="block mb-1 font-medium">Due Date</label>
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                      placeholderText="Select a due date"
                      className="w-full border rounded px-2 py-1"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                )}

                {/* Job poster if file available */}
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Poster</label>
                  <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const isImage = file.type.startsWith("image/");
                      const previewUrl = isImage ? URL.createObjectURL(file) : "";
                      setPoster({
                        name: file.name,
                        previewUrl,
                        isImage,
                      });
                    }
                  }}
                  
                  className="w-full border rounded px-2 py-1"
                  />
                  {poster && (
                  <div className="relative mt-2 w-36 h-24 border border-gray-300 rounded overflow-hidden bg-gray-50">
                    {poster.isImage ? (
                      <img
                        src={poster.previewUrl}
                        alt="Poster"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-sm text-gray-700 px-2">
                        {poster.name}
                      </div>
                    )}

                    {/* Remove icon */}
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-bl px-1 text-sm text-red-600 hover:text-red-800"
                      onClick={() => setPoster(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                </div>
                

                {/* images related to the job post */}
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Upload Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;

                      setUploadingImages(prev => prev + files.length);

                      try {
                        const urls = await uploadToCloudinary(files);
                        setImage(prev => [...prev, ...urls]);
                      } catch (err) {
                        console.error("Upload failed:", err);
                      } finally {
                        setUploadingImages(0);
                      }
                    }}
                    className="w-full border rounded px-2 py-1"
                  />

                  {/* Spinner grid during uploading */}
                  {uploadingImages > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {Array(uploadingImages).fill(null).map((_, idx) => (
                        <div
                          key={`spinner-${idx}`}
                          className="w-full h-24 bg-gray-100 flex items-center justify-center rounded border border-gray-300"
                        >
                          <svg className="animate-spin h-6 w-6 text-cyan-700" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Show uploaded images with remove icon */}
                  {image.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {image.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-full h-24">
                          <img
                            src={imgUrl}
                            alt={`Uploaded ${idx}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-bl px-1 text-sm text-red-600 hover:text-red-800"
                            onClick={() =>
                              setImage(prev => prev.filter((_, i) => i !== idx))
                            }
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Urgent check box */}
                {selectedType === 'job' && (
                <div className="mb-3">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Urgent Post</span>
                    </label>
                </div>
            )}

              {selectedType === 'job' &&  !premium && (<div className="mb-3">
                  <label className="block mb-1 font-medium">Boost</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={boostLevel}
                    onChange={e => setBoostType(e.target.value)}
                  >
                    <option value="">Select boost type</option>
                   {boostTypes.map((item, index) => (
                      <option key={index} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>)}

            </form>
        </div>

        {/* Footer */}
        <div className="border-t rounded-b-2xl px-6 py-3 flex justify-end gap-4 bg-cyan-800">
            <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                type="submit"
                className="px-6 py-2 rounded-lg bg-[#306ff7] hover:bg-[#1f3565] text-white"
                >
                Post
            </button>
        </div>
      </div>
    </div>
  );
};

export default PostJobPopup;