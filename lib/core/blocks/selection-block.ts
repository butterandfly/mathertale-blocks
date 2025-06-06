import { type MarkdownBlock, extractProperties } from '../convert-markdown-helper';
import { type BlockSchema } from '../schemas';

export const SelectionType = 'SELECTION' as const;

export interface SelectionChoice {
  key: string;
  content: string;
}

export interface SelectionQuestionData {
  choices: SelectionChoice[];
  answer: string[]; // Array of keys from choices (can be multiple)
  explanation: string;
}

export class SelectionBlockData implements BlockSchema {
  id: string;
  type: typeof SelectionType;
  content: string;
  questionData: SelectionQuestionData;
  name?: string;
  updatedAt: Date;

  constructor(id: string, content: string, questionData: SelectionQuestionData, name?: string) {
    this.id = id;
    this.content = content;
    this.questionData = questionData;
    this.type = SelectionType;
    this.name = name;
    this.updatedAt = new Date();
  }

  getText(): string {
    const { choices, answer, explanation } = this.questionData;
    let text = this.content + '\n\n';

    text += 'choices:\n';
    choices.forEach((choice) => {
      text += `${choice.key}: ${choice.content}\n`;
    });

    text += '\nanswer:\n';
    text += answer.join(', ');

    text += '\n\nexplanation:\n';
    text += explanation;

    return text;
  }

  static validate(block: SelectionBlockData): void {
    const { choices, answer, explanation } = block.questionData;

    if (choices.length === 0) {
      throw new Error(`Choices cannot be empty for block ID: ${block.id}`);
    }

    if (!explanation) {
      throw new Error(`Explanation is required for block ID: ${block.id}`);
    }

    if (!answer || answer.length === 0) {
      throw new Error(`Answer must contain at least 1 key for block ID: ${block.id}`);
    }

    const choiceKeys = choices.map((choice) => choice.key);
    for (const key of answer) {
      if (!choiceKeys.includes(key)) {
        throw new Error(
          `Answer key "${key}" does not exist in choices (${choiceKeys.join(', ')}) for block ID: ${block.id}`,
        );
      }
    }
  }

  /**
   * Markdown format for selection block
   *
   * ```
   * This is the question content.
   * It can have multiple lines and LaTeX content like $x^2$.
   *
   * #### Choices
   * a: First choice with $\alpha$
   * b: Second choice with $\beta$
   * c: Third choice with $\gamma$
   * d: Fourth choice with $\delta$
   *
   * #### Answer
   * a, c, d
   *
   * #### Explanation
   * This is the explanation.
   * It can also have multiple lines and LaTeX content.
   * ```
   */
  static fromMarkdown(markdown: MarkdownBlock): SelectionBlockData {
    const { content, properties } = extractProperties(markdown.rawTokens);

    // Parse choices from the choices property
    const choices: SelectionChoice[] = [];
    if (properties.choices) {
      const choiceLines = properties.choices.split('\n');
      choiceLines.forEach((line: string) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const content = line.substring(colonIndex + 1).trim();
          if (key && content) {
            choices.push({ key, content });
          }
        }
      });
    }

    // Parse answer from the answer property
    const answer: string[] = [];
    if (properties.answer) {
      properties.answer
        .split(',')
        .map((key: string) => key.trim())
        .forEach((key: string) => {
          if (key && !answer.includes(key)) {
            answer.push(key);
          }
        });
    }

    const block = new SelectionBlockData(
      markdown.id,
      properties.content || content || '',
      {
        choices,
        answer,
        explanation: properties.explanation || '',
      },
      markdown.name,
    );

    this.validate(block); // Validate the constructed block
    return block;
  }
}

export function convertSelectionMarkdown(markdown: MarkdownBlock): SelectionBlockData {
  return SelectionBlockData.fromMarkdown(markdown);
}
