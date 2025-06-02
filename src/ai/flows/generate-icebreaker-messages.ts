// src/ai/flows/generate-icebreaker-messages.ts
'use server';

/**
 * @fileOverview Generates icebreaker messages for addiction support group users.
 *
 * - generateIcebreakerMessages - A function that generates icebreaker messages.
 * - GenerateIcebreakerMessagesInput - The input type for the generateIcebreakerMessages function.
 * - GenerateIcebreakerMessagesOutput - The return type for the generateIcebreakerMessages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIcebreakerMessagesInputSchema = z.object({
  topic: z
    .string()
    .describe('The topic for the icebreaker messages, e.g., addiction recovery, digital detox.'),
  numMessages: z
    .number()
    .default(3)
    .describe('The number of icebreaker messages to generate.'),
});
export type GenerateIcebreakerMessagesInput = z.infer<
  typeof GenerateIcebreakerMessagesInputSchema
>;

const GenerateIcebreakerMessagesOutputSchema = z.object({
  messages: z
    .array(z.string())
    .describe('An array of icebreaker messages to start a conversation.'),
});
export type GenerateIcebreakerMessagesOutput = z.infer<
  typeof GenerateIcebreakerMessagesOutputSchema
>;

export async function generateIcebreakerMessages(
  input: GenerateIcebreakerMessagesInput
): Promise<GenerateIcebreakerMessagesOutput> {
  return generateIcebreakerMessagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIcebreakerMessagesPrompt',
  input: {schema: GenerateIcebreakerMessagesInputSchema},
  output: {schema: GenerateIcebreakerMessagesOutputSchema},
  prompt: `You are a helpful assistant that generates icebreaker messages for online support groups.

  The goal is to create messages that encourage engagement and sharing among members.

  Topic: {{{topic}}}

  Instructions: Generate {{{numMessages}}} distinct icebreaker messages suitable for starting conversations within a support group focused on {{topic}}. These messages should be open-ended, encouraging members to share their experiences, thoughts, or feelings related to {{topic}}. Ensure the messages are empathetic, supportive, and avoid giving advice or making assumptions.

  Output the messages as a JSON array of strings.
  `,
});

const generateIcebreakerMessagesFlow = ai.defineFlow(
  {
    name: 'generateIcebreakerMessagesFlow',
    inputSchema: GenerateIcebreakerMessagesInputSchema,
    outputSchema: GenerateIcebreakerMessagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
