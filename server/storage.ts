import { type User, type InsertUser, type Questionnaire, type InsertQuestionnaire, type FinancialAnalysis, type InsertFinancialAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createQuestionnaire(questionnaire: InsertQuestionnaire): Promise<Questionnaire>;
  getQuestionnaire(id: string): Promise<Questionnaire | undefined>;
  
  createFinancialAnalysis(analysis: InsertFinancialAnalysis): Promise<FinancialAnalysis>;
  getFinancialAnalysis(questionnaireId: string): Promise<FinancialAnalysis | undefined>;
  
  // Session management
  createFinancialSession(sessionId: string, formData: any): Promise<void>;
  getFinancialSession(sessionId: string): Promise<any | undefined>;
  storeAnalysis(questionnaireId: string, analysis: any): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questionnaires: Map<string, Questionnaire>;
  private financialAnalyses: Map<string, FinancialAnalysis>;
  private sessions: Map<string, any>; // Financial sessions
  private analyses: Map<string, any>; // Standalone analyses

  constructor() {
    this.users = new Map();
    this.questionnaires = new Map();
    this.financialAnalyses = new Map();
    this.sessions = new Map();
    this.analyses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createQuestionnaire(insertQuestionnaire: InsertQuestionnaire): Promise<Questionnaire> {
    const id = randomUUID();
    const questionnaire: Questionnaire = {
      ...insertQuestionnaire,
      id,
      createdAt: new Date(),
      userId: insertQuestionnaire.userId || null,
    };
    this.questionnaires.set(id, questionnaire);
    return questionnaire;
  }

  async getQuestionnaire(id: string): Promise<Questionnaire | undefined> {
    return this.questionnaires.get(id);
  }

  async createFinancialAnalysis(insertAnalysis: InsertFinancialAnalysis): Promise<FinancialAnalysis> {
    const id = randomUUID();
    const analysis: FinancialAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
    };
    this.financialAnalyses.set(id, analysis);
    return analysis;
  }

  async getFinancialAnalysis(questionnaireId: string): Promise<FinancialAnalysis | undefined> {
    return Array.from(this.financialAnalyses.values()).find(
      (analysis) => analysis.questionnaireId === questionnaireId
    );
  }

  // Session management methods
  async createFinancialSession(sessionId: string, formData: any): Promise<void> {
    this.sessions.set(sessionId, {
      sessionId,
      formData,
      createdAt: new Date(),
    });
  }

  async getFinancialSession(sessionId: string): Promise<any | undefined> {
    return this.sessions.get(sessionId)?.formData;
  }

  async storeAnalysis(questionnaireId: string, analysis: any): Promise<void> {
    this.analyses.set(questionnaireId, {
      questionnaireId,
      analysis,
      createdAt: new Date(),
    });
  }
}

export const storage = new MemStorage();
