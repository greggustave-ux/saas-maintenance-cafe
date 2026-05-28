import { ServiceCall } from "../types";

export interface MachineAnalysisResult {
    totalInterventions: number;
    interventions30Days: number;
    interventions90Days: number;
    lastInterventionDate: string | null;
    lastTechnician: string | null;
    mostFrequentParts: string[];
    hasPhotosCount: number;
    missingPhotosCount: number;
    hasSignaturesCount: number;
    missingSignaturesCount: number;
    riskScore: number;
    riskStatus: "Stable" | "À surveiller" | "Problématique";
    riskExplanation: string;
    recommendation: string;
    
    // Future extensible structure
    estimatedMaintenanceCost: number;
    averageInterventionFrequency: string;
    replacementRecommendation: string;
    downtimeRisk: "Faible" | "Moyen" | "Élevé";
}

export function analyzeMachineHistory(history: ServiceCall[]): MachineAnalysisResult {
    const totalInterventions = history.length;
    
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(now.getDate() - 90);
    
    let interventions30Days = 0;
    let interventions90Days = 0;
    let lastInterventionDate: string | null = null;
    let lastTechnician: string | null = null;
    let missingPhotosCount = 0;
    let missingSignaturesCount = 0;
    let hasKeywords = false;
    
    const keywords = ["fuite", "bruit", "erreur", "blocage", "température", "pression"];
    
    // Sort history to get the latest first
    const sortedHistory = [...history].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    });

    if (sortedHistory.length > 0) {
        const lastCall = sortedHistory[0];
        lastInterventionDate = lastCall.created_at 
            ? new Date(lastCall.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
            : "Récemment";
        lastTechnician = lastCall.technician_name || "Non assigné";
    }
    
    for (const call of history) {
        const callDate = call.created_at ? new Date(call.created_at) : new Date();
        if (callDate >= thirtyDaysAgo) {
            interventions30Days++;
        }
        if (callDate >= ninetyDaysAgo) {
            interventions90Days++;
        }
        
        if (!call.photo_url) {
            missingPhotosCount++;
        }
        if (!call.signature_url) {
            missingSignaturesCount++;
        }
        
        const noteText = ((call.technician_notes || "") + " " + (call.issue_description || "")).toLowerCase();
        if (keywords.some(kw => noteText.includes(kw))) {
            hasKeywords = true;
        }
    }
    
    // Score calculation
    let score = 0;
    
    // +20 if 3 or more interventions in 90 days
    if (interventions90Days >= 3) {
        score += 20;
    }
    // +20 if 2 or more interventions in 30 days
    if (interventions30Days >= 2) {
        score += 20;
    }
    // +15 if note contains keywords
    if (hasKeywords) {
        score += 15;
    }
    // +15 if same parts replaced (we assume this if there are multiple calls on the machine)
    const hasRepeatedParts = totalInterventions >= 2;
    if (hasRepeatedParts) {
        score += 15;
    }
    // +10 if any missing signatures
    if (missingSignaturesCount > 0) {
        score += 10;
    }
    // +10 if any missing photos
    if (missingPhotosCount > 0) {
        score += 10;
    }
    
    score = Math.min(score, 100);
    
    // Status and explanation
    let riskStatus: "Stable" | "À surveiller" | "Problématique" = "Stable";
    let riskExplanation = "Stable : peu d'interventions récentes";
    let recommendation = "Continuer le suivi normal";
    
    if (score >= 61) {
        riskStatus = "Problématique";
        riskExplanation = "Problématique : interventions répétées ou symptômes récurrents";
        recommendation = "Évaluer remplacement ou échange machine";
    } else if (score >= 31) {
        riskStatus = "À surveiller";
        riskExplanation = "À surveiller : fréquence d'intervention en hausse";
        recommendation = "Prévoir inspection approfondie";
    }
    
    // Extensible properties for future financial estimations
    const estimatedMaintenanceCost = totalInterventions * 150 + (hasRepeatedParts ? 350 : 0);
    const averageInterventionFrequency = totalInterventions > 1 
        ? `Tous les ${Math.round(90 / totalInterventions)} jours`
        : "N/A";
    
    let replacementRecommendation = "Conserver";
    if (riskStatus === "Problématique") {
        replacementRecommendation = "Remplacement recommandé";
    } else if (riskStatus === "À surveiller") {
        replacementRecommendation = "Échange standard sous surveillance";
    }
    
    let downtimeRisk: "Faible" | "Moyen" | "Élevé" = "Faible";
    if (riskStatus === "Problématique") {
        downtimeRisk = "Élevé";
    } else if (riskStatus === "À surveiller") {
        downtimeRisk = "Moyen";
    }
    
    // Mock parts
    const mostFrequentParts = hasRepeatedParts 
        ? ["Joint torique haute pression", "Fluide hydraulique"]
        : totalInterventions > 0 ? ["Filtre d'admission"] : [];
    
    return {
        totalInterventions,
        interventions30Days,
        interventions90Days,
        lastInterventionDate,
        lastTechnician,
        mostFrequentParts,
        hasPhotosCount: totalInterventions - missingPhotosCount,
        missingPhotosCount,
        hasSignaturesCount: totalInterventions - missingSignaturesCount,
        missingSignaturesCount,
        riskScore: score,
        riskStatus,
        riskExplanation,
        recommendation,
        estimatedMaintenanceCost,
        averageInterventionFrequency,
        replacementRecommendation,
        downtimeRisk
    };
}
