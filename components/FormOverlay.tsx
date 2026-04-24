'use client';

import Modal from "./Modal";
import LeadCaptureForm from "./forms/LeadCaptureForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  onSubmitSuccess?: () => void;
}

export default function FormOverlay({ isOpen, onClose, source, onSubmitSuccess }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <LeadCaptureForm
        title="Get Course Details"
        sourceName={source}
        typeFilter="PPC_Lead"
        buttonText="Get Syllabus & Fees →"
        thankYouPath="/thankyou-download-brochure"
        onSuccess={onSubmitSuccess}
      />
    </Modal>
  );
}
