import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import {ClockIcon, MapPinIcon, TagIcon, CalendarDaysIcon, BriefcaseIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import { StarIcon as SolidStarIcon, FireIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./ServiceView.css";
import {getServiceDetails} from "../../api/userAPI";

import jobImage from "../../assets/get-a-job-with-no-experience.png";

export default function ServiceView() {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount

    console.log("Opened JobView. Came from:", location.state?.from);
    console.log("Stored scroll position:", location.state?.scrollPosition);

  }, []);
  
  const handleBack = () => {
    const from = location.state?.from || { pathname: "/hire" };
    const scrollPosition = location.state?.scrollPosition || 0;
  
    navigate(from.pathname + from.search, {
      state: {
        scrollPosition,
      },
    });
  };

  interface Task {
  id: string;
  title: string;
  category: string;
  taskType?: string;
  location: string;
  isUrgent: boolean;
  isTrending?: boolean;
  daysPosted: string; // e.g., "2 days", "3 months"
  dueDate: string; // format: "YYYY-MM-DD"
  postedDate: string; // format: "YYYY-MM-DD"
  postedUserName: string;
  postedUserImage: string;
  postedUserRating?: number;
  miniDescription: string;
  budget: number;
  address: string;
  description: string;
  poster: string;
  isBookmarked: boolean;
  image: string[];
}  

  const sampleTask = {
    id: "D153",
    title: "Senior Developer",
    category: "IT & Software",
    taskType: "Full-Time", 
    location: "New York, NY",
    isUrgent: true,
    isTrending: true,
    daysPosted: "2 days",   // no of days, months or years since posted
    dueDate: "2023-12-31",
    postedDate: "2023-10-01",  // date when posted
    postedUserName: "John Doe",
    postedUserImage: jobImage,
    postedUserRating: 3.5,
    miniDescription: "Looking for a senior developer with 5+ years of experience.",
    budget: 5000,
    address: "123 Main St, New York, NY",
    description: "We are looking for a senior developer to join our team. The ideal candidate should have at least 5 years of experience in software development, with a strong background in JavaScript and React. I'm obviously missing something stupidly simple here. I have images with a white background so I want to be able to edit the arrows on the Bootstraps Carousel so they are visible. So many changing the color of the arrows (NOT the background like I've done). I'm obviously missing something stupidly simple here. I have images with a white background so I want to be able to edit the arrows on the Bootstraps Carousel so they are visible. So many changing the color of the arrows (NOT the background like I've done). I'm obviously missing something stupidly simple here. I have images with a white background so I want to be able to edit the arrows on the Bootstraps Carousel so they are visible. So many changing the color of the arrows (NOT the background like I've done).",
    poster: "https://s3-ap-southeast-1.amazonaws.com/xpresslivedonotmess-live/Vacancies/DescriptionImage_181385", // poster of the job post if exist
    isBookmarked: false,
    image: [jobImage, jobImage, jobImage],
  };

  const [task, setTask] = useState<Task>(sampleTask);

    useEffect(() => {
      async function fetchJobs() {
        try {
          if (!id) { return; } // If no ID, do not fetch
          const fetchedJob = await getServiceDetails(id);//TODO
          if (!fetchedJob) {
            //toast.error("Please try again.");
            return;
          }
          setTask(fetchedJob);
        } catch (error) {
          //toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
          console.error("Error fetching job details:", error);
        }
      }
      fetchJobs();
    }, [id]);

  // Social media share URLs
  const shareUrl = `https://sewa.lk/hire/${task.id}`;
  const shareText = encodeURIComponent(`${task.title} - Check out this job post!`);

  const whatsappUrl = `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`;

  return (
    <div className="p-8 lg:max-w-6xl max-w-full mx-auto">
      <button onClick={handleBack} className="flex items-center mb-5 space-x-2">
        <ArrowLeftCircleIcon className="h-8 w-8" />
        <span>Back</span>
      </button>

      

      <div className="flex flex-col-reverse lg:flex-row justify-between gap-4 my-4">
        {/* left side main content area */}
        <div className="w-full lg:w-2/3">
          
          {/* Task image */}
          <Carousel 
            useKeyboardArrows={true}
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay={false}
            showIndicators
            showArrows>
            {task.image.map((img, index) => (
              <div key={index}>
                <img src={img} alt={`Slide ${index + 1}`} className="object-contain h-80 w-full bg-gray-200" />
              </div>
            ))}
          </Carousel>
          
          <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
          
          <div className="flex justify-between">
            <div>
              {/* Task id */ }
              {/* <div className="flex items-center my-1">
                <IdentificationIcon className="w-4 h-4 mr-1" style={{ color: "black" }}/>
                <p className="text-gray-600 text-sm"><span className="font-bold">Task ID: </span>{task.id}</p>
              </div> */}
              
              {/* task category*/ }
              <div className="flex items-center my-1">
                <BriefcaseIcon className="w-4 h-4 mr-1" style={{ color: "black" }}/>
                <p className="text-gray-600 text-sm"><span className="font-bold">Category: </span>{task.category} ago</p>
              </div>
              
              {/* Posted Date as "days/months/years" ago */ }
              <div className="flex items-center my-1">
                <ClockIcon className="w-4 h-4 mr-1" style={{ color: "black" }}/>
                <p className="text-gray-600 text-sm"><span className="font-bold">Task posted: </span>{task.daysPosted} ago</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 justify-start mr-3">
              {/* No. of applies so far */}          
              <div className="flex items-center justify-center p-0.5 px-1">
                <p className="text-cyan-700 text-sm font-bold">7 applicants</p>
              </div>


              {/* Urgent icon */}
              {task.isUrgent && (
                <div className="flex items-center justify-end ">
                  <div className="flex items-center w-auto bg-red-500 rounded-md p-0.5">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" style={{ color: "white" }} />
                    <p className="text-white text-xs pr-1">Urgent</p>
                  </div>
                </div>
              )}

              {/* Trending icon */}
              {task.isTrending && (
                  <div className="flex items-center justify-center rounded-md border border-orange-500 p-0.5 px-1">
                  <FireIcon className="w-4 h-4 mr-0.5" style={{ color: "orange" }} />
                  <p className="text-black text-xs">Trending</p>
                </div>
              )}
            </div>
          </div>
          

          {/* horizontal line */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* Task Description */ }
          <h2 className="text-xl font-semibold my-2">Job Description</h2>
          <p className="mb-4">{task.description}</p>

          {/* Task Poster. If the task poster is not empty show it as an image. otherwise not showing anything atleast the header */}
          {task.poster && (       
            <div>
              <div className="border-t border-gray-300 my-4"></div>
              <h2 className="text-xl font-semibold mb-2">Task Poster</h2>
              <img src={task.poster} alt="Job Poster" className="w-full h-full mr-4" />
            </div>
          )}

          


          {/* Comments section */}
          <div className="border-t border-gray-300 my-4"></div>
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <div className="flex flex-col gap-2">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <p className="text-gray-600">This is a comment.</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <p className="text-gray-600">This is another comment.</p>
            </div>
          </div>  
        </div>

        {/* right side summary area */}
        <div className="w-full h-full lg:w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
          {/* user info of the task poster */}
          <div className="flex items-center mb-4 w-full">
            <img src={task.postedUserImage} alt="Job Poster" className="w-16 h-16 rounded-full mr-4" />
            <div className="flex justify-center items-start pl-4">
              <h2 className="text-xl font-semibold">{task.postedUserName}</h2>
            </div>
          </div>
          
          <div>
            <div className="flex flex-col gap-0.5">
              {/* Budget - NO BUDGET FOR TASKS */ }
              {/* <div className="flex items-center justify-center my-2">
                <p className="text-black text-2xl font-bold">Rs. {task.budget}</p>
              </div> */}

              {/* Location */ }
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1" style={{ color: "blue" }}/>
                <p className="text-gray-600 text-sm">{task.location}</p>
              </div>

              {/* Due Date - NO DUE DATE FOR TASKS*/ }
              {/* <div className="flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1" style={{ color: "orange" }}/>
                <p className="text-gray-600 text-sm">Due Date: {task.dueDate}</p>
              </div> */}

              {/* Posted Date */ }
              <div className="flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1" style={{ color: "green" }}/>
                <p className="text-gray-600 text-sm">Posted Date: {task.postedDate}</p>
              </div>        

              {/* Task Type */ }
              <div className="flex items-center">
                <TagIcon className="w-4 h-4 mr-1" style={{ color: "red" }}/>
                <p className="text-gray-600 text-sm">{task.taskType}</p>
              </div>                         
            </div>

            {/* horizontal line */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Mini Description */ } 
            <p className="text-gray-600 mb-4 text-sm">{task.miniDescription}</p>

            {/* horizontal line */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Social media icons for send */ }
            <div className="flex gap-3 justify-center mt-4">
              {/* WhatsApp */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <svg className="w-6 h-6 text-green-500 hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2.002c-5.522 0-10 4.477-10 9.998 0 1.764.468 3.452 1.355 4.951L2 22l5.25-1.37A9.935 9.935 0 0012.04 22c5.523 0 10-4.477 10-9.998s-4.477-10-10-10zm0 2c4.411 0 8 3.589 8 8 0 4.412-3.589 8-8 8a7.96 7.96 0 01-4.104-1.145l-.292-.178-3.106.812.832-3.036-.187-.311A7.94 7.94 0 014.04 12c0-4.411 3.589-8 8-8zm-1.45 4.34c-.145-.328-.3-.337-.439-.343-.113-.006-.243-.006-.374-.006-.13 0-.34.049-.519.245-.179.195-.681.665-.681 1.621 0 .956.697 1.879.794 2.008.097.13 1.338 2.055 3.3 2.886 1.634.668 1.964.536 2.319.505.354-.03 1.142-.465 1.304-.913.161-.447.161-.83.113-.913-.048-.083-.179-.13-.374-.23-.195-.098-1.142-.563-1.318-.628-.176-.065-.304-.098-.434.098-.13.195-.498.629-.611.755-.113.13-.226.146-.421.049-.195-.098-.822-.303-1.564-.966-.578-.516-.968-1.153-1.081-1.348-.113-.195-.012-.3.085-.397.087-.086.195-.226.292-.339.098-.113.13-.195.195-.325.065-.13.033-.244-.017-.342z" />
                </svg>
              </a>

              {/* Facebook */}
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                <svg className="w-6 h-6 hover:scale-110" fill="blue" viewBox="0 0 24 24">
                  <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.03C18.34 21.25 22 17.09 22 12.07z"/>
                </svg>
              </a>

              {/* Twitter (X) */}
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                <svg className="w-6 h-6 text-black hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.633 2H4.367C3.06 2 2 3.06 2 4.367v15.266C2 20.94 3.06 22 4.367 22h15.266C20.94 22 22 20.94 22 19.633V4.367C22 3.06 20.94 2 19.633 2zm-4.547 14.842h-1.7l-2.539-3.394-2.24 3.394H7.2l3.19-4.826-3.008-4.43h1.716l2.2 3.167 2.093-3.167h1.692l-3.11 4.465 3.205 4.79z" />
                </svg>
              </a>

              {/* Telegram */}
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                <svg className="w-6 h-6 hover:scale-110" fill="#24A1DE" viewBox="0 0 24 24">
                  <path d="M9.993 15.648l-.39 4.162c.56 0 .803-.242 1.097-.532l2.635-2.508 5.468 3.993c1.004.552 1.718.262 1.978-.933l3.591-16.794c.32-1.475-.517-2.059-1.497-1.674L1.42 9.267c-1.446.564-1.43 1.36-.25 1.724l4.93 1.54 11.448-7.2c.54-.34 1.03-.156.625.185L9.993 15.648z" />
                </svg>
              </a>
            </div>


            {/* Apply for Job button */ }
            <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 w-full">Apply for Job</button>
            {/* Save for later button */ }
            <button className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 w-full">Save for Later</button>
          </div>            
        </div>

      </div>
    </div>
  );
}
