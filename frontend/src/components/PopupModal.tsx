import { FC, useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
    isOpen: boolean;
    title?: string;
    onClose?: (e: any) => void;
    children?: React.ReactNode;
    className?: string;
    closeHandler?: () => void;
};

const Modal: FC<Props> = ({
    isOpen,
    onClose,
    closeHandler,
    title,
    children,
    className
}) => {
    const [open, setOpen] = useState(isOpen);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setOpen(false);
        onClose && onClose(false);
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className={`bg-white rounded-lg shadow-lg w-full max-w-md ${className}`}>
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-medium text-gray-800 flex-1 mr-4 ml-4 mt-2">
                            {title}
                        </h2>
                        
                        <button 
                            onClick={closeHandler ?? handleClose} 
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            title="Close"
                        >
                            <XMarkIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                        </button>
                    </div>
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
            )}
        </>
    );
};

export default Modal;