import React from 'react';
import { JamSessionService } from '../services/JamSessionService';
import { FeedbackService } from '../services/FeedbackService';
interface StudioInterfaceProps {
    jamSessionService: JamSessionService;
    feedbackService: FeedbackService;
}
export declare const StudioInterface: React.FC<StudioInterfaceProps>;
export {};
