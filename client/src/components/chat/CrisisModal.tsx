import { useState } from 'react';
import { X, Phone, Heart, Users, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Crisis Resources</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Immediate Crisis Help
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988</p>
              <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
              <p><strong>Emergency Services:</strong> Call 911</p>
              <p><strong>International:</strong> Visit <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-red-700 underline">findahelpline.com</a></p>
            </div>
          </div>
          
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              Mental Health Support
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>NAMI Helpline:</strong> 1-800-950-NAMI (6264)</p>
              <p><strong>SAMHSA Helpline:</strong> 1-800-662-4357</p>
              <p><strong>Teen Line:</strong> Call 310-855-4673 or text TEEN to 839863</p>
              <p><strong>LGBT National Hotline:</strong> 1-888-843-4564</p>
            </div>
          </div>
          
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Online Communities & Resources
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>7 Cups:</strong> Free emotional support chat</p>
              <p><strong>Crisis Text Line:</strong> 24/7 text support</p>
              <p><strong>Mental Health America:</strong> <a href="https://mhanational.org" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">mhanational.org</a></p>
              <p><strong>National Suicide Prevention Lifeline:</strong> <a href="https://suicidepreventionlifeline.org" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">988lifeline.org</a></p>
            </div>
          </div>

          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <h3 className="font-semibold text-purple-800 mb-2">International Resources</h3>
            <div className="space-y-2 text-sm">
              <p><strong>UK:</strong> Samaritans - 116 123</p>
              <p><strong>Canada:</strong> Talk Suicide Canada - 1-833-456-4566</p>
              <p><strong>Australia:</strong> Lifeline - 13 11 14</p>
              <p><strong>Global:</strong> <a href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" rel="noopener noreferrer" className="text-purple-700 underline">International Crisis Centers</a></p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
