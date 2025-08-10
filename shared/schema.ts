import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const questionnaires = pgTable("questionnaires", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const financialAnalyses = pgTable("financial_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionnaireId: varchar("questionnaire_id").notNull(),
  aiInsights: text("ai_insights").notNull(),
  spendingBreakdown: jsonb("spending_breakdown").notNull(),
  needsWantsAnalysis: jsonb("needs_wants_analysis").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  goalTimeline: jsonb("goal_timeline").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Questionnaire data schema
export const questionnaireDataSchema = z.object({
  // Salary & Income
  monthly_income: z.number().min(0),
  side_income: z.enum(["Yes", "No"]),
  side_income_amount: z.number().min(0).optional(),
  bonus_pay: z.enum(["Yes", "No", "Sometimes"]),
  
  // Living Situation & Rent
  housing_status: z.enum(["Rent", "Own", "Living with family"]),
  housing_expenses: z.number().min(0),
  utility_bills: z.number().min(0),
  household_size: z.number().min(1),
  
  // Food & Dining
  groceries_weekly: z.number().min(0),
  dining_monthly: z.number().min(0),
  food_ordering: z.enum(["Daily", "Few times a week", "Rarely"]),
  
  // Shopping Habits
  shopping_monthly: z.number().min(0),
  impulse_shopping: z.number().min(1).max(5),
  online_shopping: z.enum(["Daily", "Weekly", "Monthly", "Rarely"]),
  
  // Subscriptions & Entertainment
  subscriptions: z.array(z.string()),
  subscription_cost: z.number().min(0),
  entertainment_hours: z.number().min(0),
  
  // Travel & Transportation
  commute_cost: z.number().min(0),
  transport_mode: z.enum(["Public Transport", "Own Vehicle", "Both"]),
  transport_monthly: z.number().min(0),
  
  // Debt / Loans
  has_loans: z.enum(["Yes", "No"]),
  loan_repayment: z.number().min(0).optional(),
  loan_type: z.enum(["Education", "Car", "Home", "Personal", "Credit Card"]).optional(),
  
  // Investments & Financial Goals
  investment_types: z.array(z.string()),
  monthly_investment: z.number().min(0),
  financial_goals: z.array(z.object({
    description: z.string().min(1),
    target_amount: z.number().min(1000),
    timeline_months: z.number().min(1).max(120),
    priority: z.enum(["high", "medium", "low"]),
    category: z.enum(["emergency", "investment", "purchase", "retirement", "education", "other"])
  })),
  
  // Budgeting Behavior & Mindset
  track_spending: z.enum(["Yes", "No"]),
  impulse_control: z.number().min(1).max(5),
  saving_behavior: z.number().min(1).max(10),
  risk_taking: z.enum(["Low", "Medium", "High"]),
  
  // Commitment & Willingness
  expense_reduction: z.number().min(1).max(10),
  preferred_savings: z.number().min(0),
  financial_discipline: z.number().min(1).max(5),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuestionnaireSchema = createInsertSchema(questionnaires).pick({
  userId: true,
  data: true,
});

export const insertFinancialAnalysisSchema = createInsertSchema(financialAnalyses).pick({
  questionnaireId: true,
  aiInsights: true,
  spendingBreakdown: true,
  needsWantsAnalysis: true,
  recommendations: true,
  goalTimeline: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type QuestionnaireData = z.infer<typeof questionnaireDataSchema>;
export type Questionnaire = typeof questionnaires.$inferSelect;
export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export type FinancialAnalysis = typeof financialAnalyses.$inferSelect;
export type InsertFinancialAnalysis = z.infer<typeof insertFinancialAnalysisSchema>;
