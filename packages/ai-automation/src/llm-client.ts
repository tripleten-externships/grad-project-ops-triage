/**
 * LLM API client wrapper
 * Supports OpenAI, Anthropic, and other providers
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

interface LLMPrediction {
  category: string;
  category_confidence: number;
  priority: string;
  priority_confidence: number;
  reasoning: string;
}

export class LLMClient {
  private provider: string;
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  
  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'openai';
    
    if (this.provider === 'openai') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else if (this.provider === 'anthropic') {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }
  }
  
  /**
   * Categorize and prioritize a request
   */
  async categorizeRequest(title: string, description: string): Promise<LLMPrediction> {
    const promptTemplate = this.loadPrompt('categorize-request.txt');
    const prompt = promptTemplate
      .replace('{title}', title)
      .replace('{description}', description);
    
    const response = await this.callLLM(prompt, {
      maxTokens: 200,
      temperature: 0.3
    });
    
    // Parse JSON response
    try {
      const parsed = JSON.parse(response);
      return {
        category: parsed.category,
        category_confidence: parsed.category_confidence,
        priority: parsed.priority,
        priority_confidence: parsed.priority_confidence,
        reasoning: parsed.reasoning
      };
    } catch (error) {
      throw new Error(`Failed to parse LLM response: ${error.message}`);
    }
  }
  
  /**
   * Summarize a request
   */
  async summarizeRequest(title: string, description: string): Promise<string> {
    const promptTemplate = this.loadPrompt('summarize-request.txt');
    const prompt = promptTemplate
      .replace('{title}', title)
      .replace('{description}', description);
    
    const summary = await this.callLLM(prompt, {
      maxTokens: 100,
      temperature: 0.5
    });
    
    return summary.trim();
  }
  
  /**
   * Call LLM API (provider-agnostic)
   */
  private async callLLM(
    prompt: string,
    options: { maxTokens: number; temperature: number }
  ): Promise<string> {
    if (this.provider === 'openai') {
      return this.callOpenAI(prompt, options);
    } else if (this.provider === 'anthropic') {
      return this.callAnthropic(prompt, options);
    } else {
      throw new Error(`Unsupported LLM provider: ${this.provider}`);
    }
  }
  
  /**
   * Call OpenAI API
   */
  private async callOpenAI(
    prompt: string,
    options: { maxTokens: number; temperature: number }
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }
    
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    
    const completion = await this.openai.chat.completions.create({
      model,
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: options.maxTokens,
      temperature: options.temperature
    });
    
    return completion.choices[0]?.message?.content || '';
  }
  
  /**
   * Call Anthropic API
   */
  private async callAnthropic(
    prompt: string,
    options: { maxTokens: number; temperature: number }
  ): Promise<string> {
    if (!this.anthropic) {
      throw new Error('Anthropic client not initialized');
    }
    
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229';
    
    const message = await this.anthropic.messages.create({
      model,
      max_tokens: options.maxTokens,
      temperature: options.temperature,
      messages: [
        { role: 'user', content: prompt }
      ]
    });
    
    const content = message.content[0];
    return content.type === 'text' ? content.text : '';
  }
  
  /**
   * Load prompt template from file
   */
  private loadPrompt(filename: string): string {
    const promptPath = path.join(__dirname, '../prompts', filename);
    return fs.readFileSync(promptPath, 'utf-8');
  }
}
