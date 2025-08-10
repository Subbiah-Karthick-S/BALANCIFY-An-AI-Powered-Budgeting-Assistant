import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { questionnaireDataSchema, insertQuestionnaireSchema, insertFinancialAnalysisSchema } from "@shared/schema";
import { analyzeFinancialData } from "./services/gemini";
import { generateFinancialReport } from "./services/pdfGenerator";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Submit questionnaire and get analysis
  app.post("/api/questionnaire", async (req, res) => {
    try {
      // Validate questionnaire data
      const validatedData = questionnaireDataSchema.parse(req.body);
      
      // Store questionnaire
      const questionnaire = await storage.createQuestionnaire({
        userId: null, // For now, no user authentication
        data: validatedData,
      });
      
      // Analyze financial data with AI
      const analysisResult = await analyzeFinancialData(validatedData);
      
      // Store analysis
      const financialAnalysis = await storage.createFinancialAnalysis({
        questionnaireId: questionnaire.id,
        aiInsights: JSON.stringify(analysisResult.insights),
        spendingBreakdown: analysisResult.spendingBreakdown,
        needsWantsAnalysis: analysisResult.needsWantsAnalysis,
        recommendations: analysisResult.recommendations,
        goalTimeline: analysisResult.goalTimeline,
      });
      
      res.json({
        questionnaireId: questionnaire.id,
        analysisId: financialAnalysis.id,
        ...analysisResult,
      });
    } catch (error: any) {
      console.error("Error processing questionnaire:", error);
      res.status(400).json({ 
        error: "Failed to process questionnaire",
        details: error.message 
      });
    }
  });
  
  // Get analysis by questionnaire ID
  app.get("/api/analysis/:questionnaireId", async (req, res) => {
    try {
      const { questionnaireId } = req.params;
      
      const questionnaire = await storage.getQuestionnaire(questionnaireId);
      if (!questionnaire) {
        return res.status(404).json({ error: "Questionnaire not found" });
      }
      
      const analysis = await storage.getFinancialAnalysis(questionnaireId);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }
      
      res.json({
        questionnaire,
        analysis,
      });
    } catch (error: any) {
      console.error("Error getting analysis:", error);
      res.status(500).json({ 
        error: "Failed to get analysis",
        details: error.message 
      });
    }
  });
  
  // Generate and download PDF report
  app.get("/api/report/:questionnaireId", async (req, res) => {
    try {
      const { questionnaireId } = req.params;
      
      const analysis = await storage.getFinancialAnalysis(questionnaireId);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }
      
      const pdfBuffer = await generateFinancialReport(analysis);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=financial-report-${questionnaireId}.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ 
        error: "Failed to generate PDF report",
        details: error.message 
      });
    }
  });
  
  // Simulate what-if scenarios
  app.post("/api/simulate", async (req, res) => {
    try {
      const { questionnaireId, adjustments } = req.body;
      
      const questionnaire = await storage.getQuestionnaire(questionnaireId);
      if (!questionnaire) {
        return res.status(404).json({ error: "Questionnaire not found" });
      }
      
      // Apply adjustments to the original data
      const originalData = questionnaire.data as any;
      const adjustedData = { ...originalData, ...adjustments };
      
      // Re-analyze with adjusted data
      const simulationResult = await analyzeFinancialData(adjustedData);
      
      res.json(simulationResult);
    } catch (error: any) {
      console.error("Error running simulation:", error);
      res.status(500).json({ 
        error: "Failed to run simulation",
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
