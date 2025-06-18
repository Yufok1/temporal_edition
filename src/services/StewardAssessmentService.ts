import { 
    StewardAssessment, 
    StewardFeedback, 
    StewardCapabilities, 
    StewardPerformanceMetrics,
    InteractionType,
    WhaleResponse,
    ResponseType
} from '../types/steward';
import { EmotionalTone, TranslationContext } from '../types/translation';

export class StewardAssessmentService {
    private stewardAssessments: Map<string, StewardAssessment>;
    private stewardCapabilities: Map<string, StewardCapabilities>;
    private performanceMetrics: Map<string, StewardPerformanceMetrics>;

    constructor() {
        this.stewardAssessments = new Map();
        this.stewardCapabilities = new Map();
        this.performanceMetrics = new Map();
    }

    /**
     * Evaluates a steward's performance during a whale interaction
     */
    public evaluateStewardPerformance(
        stewardID: string,
        interactionType: InteractionType,
        emotionalTone: EmotionalTone,
        context: TranslationContext,
        whaleResponse: WhaleResponse
    ): StewardFeedback {
        const assessment = this.getStewardAssessment(stewardID);
        const capabilities = this.getStewardCapabilities(stewardID);
        
        // Calculate feedback score based on various factors
        const feedbackScore = this.calculateFeedbackScore(
            assessment,
            capabilities,
            interactionType,
            emotionalTone,
            context,
            whaleResponse
        );

        const feedback: StewardFeedback = {
            timestamp: new Date(),
            interactionType,
            emotionalTone,
            feedbackScore,
            feedbackNotes: this.generateFeedbackNotes(feedbackScore, whaleResponse),
            whaleResponse
        };

        // Update steward's assessment with the new feedback
        this.updateStewardAssessment(stewardID, feedback);

        return feedback;
    }

    /**
     * Updates a steward's assessment based on new feedback
     */
    private updateStewardAssessment(stewardID: string, feedback: StewardFeedback): void {
        const currentAssessment = this.getStewardAssessment(stewardID);
        
        // Update assessment scores based on feedback
        const updatedAssessment: StewardAssessment = {
            ...currentAssessment,
            emotionalIntelligence: this.calculateEmotionalIntelligence(currentAssessment, feedback),
            culturalSensitivity: this.calculateCulturalSensitivity(currentAssessment, feedback),
            communicationEffectiveness: this.calculateCommunicationEffectiveness(currentAssessment, feedback),
            adaptability: this.calculateAdaptability(currentAssessment, feedback),
            feedbackHistory: [...currentAssessment.feedbackHistory, feedback],
            lastUpdated: new Date()
        };

        this.stewardAssessments.set(stewardID, updatedAssessment);
        this.updatePerformanceMetrics(stewardID, updatedAssessment);
    }

    /**
     * Calculates the feedback score for a steward's performance
     */
    private calculateFeedbackScore(
        assessment: StewardAssessment,
        capabilities: StewardCapabilities,
        interactionType: InteractionType,
        emotionalTone: EmotionalTone,
        context: TranslationContext,
        whaleResponse: WhaleResponse
    ): number {
        let score = 0;

        // Base score on emotional intelligence
        score += assessment.emotionalIntelligence * 0.3;

        // Add cultural sensitivity component
        score += assessment.culturalSensitivity * 0.2;

        // Consider communication effectiveness
        score += assessment.communicationEffectiveness * 0.2;

        // Factor in adaptability
        score += assessment.adaptability * 0.2;

        // Adjust based on whale response
        score += this.calculateWhaleResponseScore(whaleResponse) * 0.1;

        // Normalize score to 0-100 range
        return Math.min(Math.max(score, 0), 100);
    }

    /**
     * Calculates score based on whale's response
     */
    private calculateWhaleResponseScore(whaleResponse: WhaleResponse): number {
        let score = whaleResponse.engagementLevel;

        // Adjust score based on response type
        switch (whaleResponse.responseType) {
            case 'positive':
                score *= 1.2;
                break;
            case 'engaged':
                score *= 1.1;
                break;
            case 'neutral':
                score *= 1.0;
                break;
            case 'confused':
                score *= 0.8;
                break;
            case 'negative':
                score *= 0.6;
                break;
            case 'disengaged':
                score *= 0.5;
                break;
        }

        // Factor in context match
        score = (score + whaleResponse.contextMatch) / 2;

        return score;
    }

    /**
     * Generates feedback notes based on performance
     */
    private generateFeedbackNotes(score: number, whaleResponse: WhaleResponse): string {
        const notes: string[] = [];

        if (score >= 90) {
            notes.push("Exceptional performance in understanding and responding to whale communication.");
        } else if (score >= 75) {
            notes.push("Strong performance with good emotional connection.");
        } else if (score >= 60) {
            notes.push("Adequate performance with room for improvement.");
        } else {
            notes.push("Needs improvement in understanding and responding to whale communication.");
        }

        // Add specific feedback based on whale response
        if (whaleResponse.engagementLevel >= 80) {
            notes.push("Excellent whale engagement and interaction.");
        } else if (whaleResponse.engagementLevel <= 40) {
            notes.push("Low whale engagement - consider adjusting communication approach.");
        }

        return notes.join(" ");
    }

    /**
     * Updates performance metrics for a steward
     */
    private updatePerformanceMetrics(stewardID: string, assessment: StewardAssessment): void {
        const feedbackHistory = assessment.feedbackHistory;
        const recentFeedback = feedbackHistory.slice(-10); // Consider last 10 interactions

        const metrics: StewardPerformanceMetrics = {
            averageEmotionalIntelligence: this.calculateAverage(recentFeedback.map(f => f.feedbackScore)),
            averageCulturalSensitivity: assessment.culturalSensitivity,
            averageCommunicationEffectiveness: assessment.communicationEffectiveness,
            averageAdaptability: assessment.adaptability,
            successRate: this.calculateSuccessRate(recentFeedback),
            improvementRate: this.calculateImprovementRate(feedbackHistory),
            whaleEngagementScore: this.calculateAverage(recentFeedback.map(f => f.whaleResponse.engagementLevel))
        };

        this.performanceMetrics.set(stewardID, metrics);
    }

    /**
     * Helper method to calculate average from array of numbers
     */
    private calculateAverage(numbers: number[]): number {
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }

    /**
     * Calculates success rate from feedback history
     */
    private calculateSuccessRate(feedback: StewardFeedback[]): number {
        const successfulInteractions = feedback.filter(f => f.feedbackScore >= 70).length;
        return (successfulInteractions / feedback.length) * 100;
    }

    /**
     * Calculates improvement rate over time
     */
    private calculateImprovementRate(feedback: StewardFeedback[]): number {
        if (feedback.length < 2) return 0;

        const recentScores = feedback.slice(-5).map(f => f.feedbackScore);
        const olderScores = feedback.slice(-10, -5).map(f => f.feedbackScore);

        const recentAverage = this.calculateAverage(recentScores);
        const olderAverage = this.calculateAverage(olderScores);

        return ((recentAverage - olderAverage) / olderAverage) * 100;
    }

    /**
     * Gets or creates a steward assessment
     */
    private getStewardAssessment(stewardID: string): StewardAssessment {
        if (!this.stewardAssessments.has(stewardID)) {
            const newAssessment: StewardAssessment = {
                stewardID,
                emotionalIntelligence: 50,
                culturalSensitivity: 50,
                communicationEffectiveness: 50,
                adaptability: 50,
                feedbackHistory: [],
                lastUpdated: new Date()
            };
            this.stewardAssessments.set(stewardID, newAssessment);
        }
        return this.stewardAssessments.get(stewardID)!;
    }

    /**
     * Gets or creates steward capabilities
     */
    private getStewardCapabilities(stewardID: string): StewardCapabilities {
        if (!this.stewardCapabilities.has(stewardID)) {
            const newCapabilities: StewardCapabilities = {
                emotionalIntelligence: 50,
                culturalSensitivity: 50,
                communicationEffectiveness: 50,
                adaptability: 50,
                languageProficiency: {},
                specializations: []
            };
            this.stewardCapabilities.set(stewardID, newCapabilities);
        }
        return this.stewardCapabilities.get(stewardID)!;
    }

    // Helper methods for calculating individual assessment components
    private calculateEmotionalIntelligence(assessment: StewardAssessment, feedback: StewardFeedback): number {
        const currentScore = assessment.emotionalIntelligence;
        const feedbackScore = feedback.feedbackScore;
        return this.updateScore(currentScore, feedbackScore, 0.3);
    }

    private calculateCulturalSensitivity(assessment: StewardAssessment, feedback: StewardFeedback): number {
        const currentScore = assessment.culturalSensitivity;
        const feedbackScore = feedback.feedbackScore;
        return this.updateScore(currentScore, feedbackScore, 0.2);
    }

    private calculateCommunicationEffectiveness(assessment: StewardAssessment, feedback: StewardFeedback): number {
        const currentScore = assessment.communicationEffectiveness;
        const feedbackScore = feedback.feedbackScore;
        return this.updateScore(currentScore, feedbackScore, 0.2);
    }

    private calculateAdaptability(assessment: StewardAssessment, feedback: StewardFeedback): number {
        const currentScore = assessment.adaptability;
        const feedbackScore = feedback.feedbackScore;
        return this.updateScore(currentScore, feedbackScore, 0.3);
    }

    /**
     * Updates a score based on new feedback with a learning rate
     */
    private updateScore(currentScore: number, feedbackScore: number, learningRate: number): number {
        return currentScore + (feedbackScore - currentScore) * learningRate;
    }
} 