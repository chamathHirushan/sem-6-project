import { Button } from "antd";
import Modal from './PopupModal';
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import useI18n from "../locale/useI18n";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) => {
    const {t} = useI18n("userPopups");

    return (
        <Modal
            className="w-96"
            title={t('deactivate.title')}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex flex-row mt-2 p-2 bg-pink-200/50 rounded-md text-xs text-gray-800 max-w-max">
                <InformationCircleIcon className="w-4 h-4 mr-2" />
                <p className="text-left ml-0.5 text-xs">
                    <span className="font-normal">{t("deactivate.warn")}:</span> {t("deactivate.sub_text")}
                </p>
            </div>
            <br />
            <div className="flex justify-end gap-4 hov">
                <Button
                    type="text"
                    className="text-black border-2 border-black px-4 py-1"
                    onClick={() => {
                        onConfirm();
                    }}
                >
                    {t("deactivate.text1")}
                </Button>
                <Button
                    type="text"
                    className="text-white bg-black px-4 py-1"
                    onClick={onClose}
                >
                    {t("deactivate.text2")}
                </Button>
            </div>
        </Modal>
    );
};


interface EditConfirmationModalProps {
    to: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const EditConfirmationModal = ({ to, isOpen, onClose, onConfirm }: EditConfirmationModalProps) => {
    const {t} = useI18n("userPopups");

    return (
        <Modal
            className="w-96"
            title={t('edit.title')+ ` ${to}`}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex flex-row mt-2 p-2 bg-pink-200/50 rounded-md text-xs text-gray-800 max-w-max">
                <InformationCircleIcon className="w-4 h-4 mr-2" />
                <p className="text-left ml-0.5 text-xs">
                    <span className="font-normal">{t("edit.warn")}:</span> {t("edit.sub_text")}
                </p>
            </div>
            <br />
            <div className="flex justify-end gap-4 hov">
                <Button
                    type="text"
                    className="text-black border-2 border-black px-4 py-1"
                    onClick={() => {
                        onConfirm();
                    }}
                >
                    {t("edit.text1")}
                </Button>
                <Button
                    type="text"
                    className="text-white bg-black px-4 py-1"
                    onClick={onClose}
                >
                    {t("edit.text2")}
                </Button>
            </div>
        </Modal>
    );
};