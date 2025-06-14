import { describe, it, expect } from 'vitest';

import type { MarkdownBlock } from './convert-markdown-helper';
import type { BlockSchema } from './schemas';
import {
  convertObsidianLinks,
  convertQuestMarkdown,
  registerBlockConverter,
} from './convert-quest-markdown';

describe('convertQuestMarkdown', () => {
  it('should convert markdown to quest schema', () => {
    const markdown = `# Quest: Test Quest
id: test-id
desc: This is a test quest.
tags: tag 1, tag 2

## Section: Introduction

### para: Welcome
id: para-welcome

This is the welcome paragraph.

#### Content
Welcome to the quest!

## Section: Main Content

### Para: Explanation
id: para-explanation

This explains the concept.

#### Content
Here's the main explanation.

#### Hint
This is a hint.

### PARA: Conclusion
id: para-conclusion

This is the conclusion.

#### Content
That's all for this quest.
`;

    const result = convertQuestMarkdown(markdown);

    // 检查顶层属性
    expect(result.name).toBe('Test Quest');
    // 修复后，quest.id正确地保留了header中的id值
    expect(result.id).toBe('test-id');
    expect(result.desc).toBe('This is a test quest.');
    expect(result.blockCount).toBe(3);
    expect(result.dependentQuests).toEqual([]);
    expect(result.childQuests).toEqual([]);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.tags).toEqual(['tag 1', 'tag 2']);

    // 检查sections
    expect(result.sections.length).toBe(2);

    // 第一个section
    const firstSection = result.sections[0]!;
    expect(firstSection.name).toBe('Introduction');
    expect(firstSection.blocks.length).toBe(1);
    expect(firstSection.blocks[0]!.id).toBe('para-welcome');
    expect(firstSection.blocks[0]!.type).toBe('PARA');

    // 第二个section
    const secondSection = result.sections[1]!;
    expect(secondSection.name).toBe('Main Content');
    expect(secondSection.blocks.length).toBe(2);
    expect(secondSection.blocks[0]!.id).toBe('para-explanation');
    expect(secondSection.blocks[0]!.type).toBe('PARA');
    expect(secondSection.blocks[1]!.id).toBe('para-conclusion');
    expect(secondSection.blocks[1]!.type).toBe('PARA');
  });

  it('should throw error for unknown block type', () => {
    const markdown = `# Quest: Unknown Block Quest
id: unknown-block
desc: Testing unknown block type.

## Section: Test

### Unknown: Test Block
id: unknown-block

This is an unknown block type.

#### Content
Content of unknown block.
`;

    expect(() => convertQuestMarkdown(markdown)).toThrow(
      'No converter registered for block type: unknown',
    );
  });

  it('should handle empty sections', () => {
    const markdown = `# Quest: Empty Section Quest
id: empty-section
desc: Testing empty sections.

## Section: Empty Section

## Section: Content Section

### Para: Only Block
id: para-only

The only block in the quest.

#### Content
This is the only content.
`;

    const result = convertQuestMarkdown(markdown);

    expect(result.sections.length).toBe(2);
    expect(result.sections[0]!.name).toBe('Empty Section');
    expect(result.sections[0]!.blocks.length).toBe(0);
    expect(result.sections[1]!.name).toBe('Content Section');
    expect(result.sections[1]!.blocks.length).toBe(1);
    expect(result.blockCount).toBe(1);
  });

  it('should use custom block converter when registered', () => {
    // 注册一个自定义的转换函数
    registerBlockConverter('custom', (block: MarkdownBlock): BlockSchema => {
      return {
        id: block.id || 'default-id',
        type: 'custom',
        name: block.name || 'Default Name',
        content: 'Custom content',
        questionData: {
          customField: 'Custom value',
        },
        getText: () => 'Custom content',
      };
    });

    const markdown = `# Quest: Custom Block Quest
id: custom-block-quest
desc: Testing custom block converter.

## Section: Custom

### Custom: My Block
id: custom-block

Custom block content.

#### Content
Custom content.
`;

    const result = convertQuestMarkdown(markdown);

    expect(result.sections[0]!.blocks[0]!.type).toBe('custom');
    expect(result.sections[0]!.blocks[0]!.id).toBe('custom-block');
    expect(result.sections[0]!.blocks[0]!.name).toBe('My Block');
    expect(result.sections[0]!.blocks[0]!.questionData).toEqual({ customField: 'Custom value' });
  });

  it('should convert markdown to quest schema with category', () => {
    const markdown = `# Quest: Test Quest with Category
id: test-id-category
desc: This is a test quest with a category.
category: Foundational Mathematics

## Section: Introduction

### para: Welcome
id: para-welcome

This is the welcome paragraph.

#### Content
Welcome to the quest!`;

    const result = convertQuestMarkdown(markdown);

    // Check top-level properties
    expect(result.name).toBe('Test Quest with Category');
    expect(result.id).toBe('test-id-category');
    expect(result.desc).toBe('This is a test quest with a category.');
    expect(result.category).toBe('Foundational Mathematics');
    expect(result.blockCount).toBe(1);
    expect(result.dependentQuests).toEqual([]);
    expect(result.childQuests).toEqual([]);
    expect(result.updatedAt).toBeInstanceOf(Date);

    // Check sections
    expect(result.sections.length).toBe(1);
    expect(result.sections[0]!.name).toBe('Introduction');
    expect(result.sections[0]!.blocks.length).toBe(1);
    expect(result.sections[0]!.blocks[0]!.id).toBe('para-welcome');
    expect(result.sections[0]!.blocks[0]!.type).toBe('PARA');
  });

  it('should handle Obsidian links', () => {
    const markdown = `# Quest: Obsidian Links Quest
id: obsidian-links
desc: Testing obsidian links.

## Section: All Blocks

### para: A Para Block
id: para-block

This is a image: ![[foo.png]]`;

    const result = convertQuestMarkdown(markdown);

    expect(result.sections[0]!.blocks[0]!.content).toBe('This is a image: ![foo](/assets/foo.png)');
  });
});

describe('convertAllBlocks', () => {
  it('should convert all blocks', () => {
    const markdown = `# Quest: All Blocks Quest
id: all-blocks
desc: Testing all blocks.
tags: tag 1, tag 2

## Section: All Blocks

### para: A Para Block
id: para-block

This is a para block.


### definition: Definition Block
id: definition-block

This is a definition block.

### fact: Fact Block
id: fact-block

This is a fact block.

### theorem: Theorem Block
id: theorem-block

This is a theorem block.

### proposition: Proposition Block
id: proposition-block

This is a proposition block.

### remark: Remark Block
id: remark-block

This is a remark block.

### lemma: Lemma Block
id: lemma-block

This is a lemma block.

### single_choice:
id: single-choice-block-all-blocks

What is 2 + 2?

#### Choices
a: 3
b: 4
c: 5

#### Answer
b

#### Explanation
Basic arithmetic: 2 + 2 = 4

### proof_reorder: Proof Reorder Block
id: proof-reorder-block-all-blocks

Prove that 2 + 2 = 4.

#### Part 1
1

#### Part 2
2

#### Part 3
3

#### Question Order
3,1,2

### selection: Selection Block
id: selection-block-all-blocks

Which of the following are prime numbers?

#### Choices
a: 2
b: 4
c: 3
d: 6
e: 5

#### Answer
a, c, e

#### Explanation
Prime numbers are numbers greater than 1 that have no divisors other than 1 and themselves. 2, 3, and 5 are prime, while 4 and 6 are composite.

### contradiction: Contradiction Block
id: contradiction-block-all-blocks

This is a contradiction block.

#### Choices
a: First choice
b: Second choice
c: Third choice
d: Fourth choice

#### Answer
a, c

#### Explanation
This is the explanation.
`;

    const result = convertQuestMarkdown(markdown);

    const paraBlock = result.sections[0]!.blocks[0]!;
    expect(paraBlock.type).toBe('PARA');
    expect(paraBlock.content).toBe('This is a para block.');

    const definitionBlock = result.sections[0]!.blocks[1]!;
    expect(definitionBlock.type).toBe('DEFINITION');
    expect(definitionBlock.content).toBe('This is a definition block.');

    const factBlock = result.sections[0]!.blocks[2]!;
    expect(factBlock.type).toBe('FACT');
    expect(factBlock.content).toBe('This is a fact block.');

    const theoremBlock = result.sections[0]!.blocks[3]!;
    expect(theoremBlock.type).toBe('THEOREM');
    expect(theoremBlock.content).toBe('This is a theorem block.');

    const propositionBlock = result.sections[0]!.blocks[4]!;
    expect(propositionBlock.type).toBe('PROPOSITION');
    expect(propositionBlock.content).toBe('This is a proposition block.');

    const remarkBlock = result.sections[0]!.blocks[5]!;
    expect(remarkBlock.type).toBe('REMARK');
    expect(remarkBlock.content).toBe('This is a remark block.');

    const lemmaBlock = result.sections[0]!.blocks[6]!;
    expect(lemmaBlock.type).toBe('LEMMA');
    expect(lemmaBlock.content).toBe('This is a lemma block.');

    const singleChoiceBlock = result.sections[0]!.blocks[7]!;
    expect(singleChoiceBlock.type).toBe('SINGLE_CHOICE');
    expect(singleChoiceBlock.content).toBe('What is 2 + 2?');

    const singleChoiceQuestionData = singleChoiceBlock.questionData as {
      choices: { key: string; content: string }[];
      answer: string;
      explanation: string;
    };
    expect(singleChoiceQuestionData.choices).toEqual([
      { key: 'a', content: '3' },
      { key: 'b', content: '4' },
      { key: 'c', content: '5' },
    ]);
    expect(singleChoiceQuestionData.answer).toBe('b');
    expect(singleChoiceQuestionData.explanation).toBe('Basic arithmetic: 2 + 2 = 4');

    const proofReorderBlock = result.sections[0]!.blocks[8]!;
    expect(proofReorderBlock.type).toBe('PROOF_REORDER');
    expect(proofReorderBlock.content).toBe('Prove that 2 + 2 = 4.');
    const proofReorderQuestionData = proofReorderBlock.questionData as {
      orderItems: { id: string; content: string }[];
      questionOrder: string;
    };
    expect(proofReorderQuestionData.orderItems).toEqual([
      { id: '1', content: '1' },
      { id: '2', content: '2' },
      { id: '3', content: '3' },
    ]);
    expect(proofReorderQuestionData.questionOrder).toBe('3,1,2');

    const selectionBlock = result.sections[0]!.blocks[9]!;
    expect(selectionBlock.type).toBe('SELECTION');
    expect(selectionBlock.content).toBe('Which of the following are prime numbers?');
    const selectionQuestionData = selectionBlock.questionData as {
      choices: { key: string; content: string }[];
      answer: string[];
      explanation: string;
    };
    expect(selectionQuestionData.choices).toEqual([
      { key: 'a', content: '2' },
      { key: 'b', content: '4' },
      { key: 'c', content: '3' },
      { key: 'd', content: '6' },
      { key: 'e', content: '5' },
    ]);
    expect(selectionQuestionData.answer).toEqual(['a', 'c', 'e']);
    expect(selectionQuestionData.explanation).toBe(
      'Prime numbers are numbers greater than 1 that have no divisors other than 1 and themselves. 2, 3, and 5 are prime, while 4 and 6 are composite.',
    );

    const contradictionBlock = result.sections[0]!.blocks[10]!;
    expect(contradictionBlock.type).toBe('CONTRADICTION');
    expect(contradictionBlock.content).toBe('This is a contradiction block.');
    const contradictionQuestionData = contradictionBlock.questionData as {
      choices: { key: string; content: string }[];
      answer: string[];
      explanation: string;
    };
    expect(contradictionQuestionData.choices).toEqual([
      { key: 'a', content: 'First choice' },
      { key: 'b', content: 'Second choice' },
      { key: 'c', content: 'Third choice' },
      { key: 'd', content: 'Fourth choice' },
    ]);
    expect(contradictionQuestionData.answer).toEqual(['a', 'c']);
    expect(contradictionQuestionData.explanation).toBe('This is the explanation.');

    expect(result.id).toBe('all-blocks');
    expect(result.name).toBe('All Blocks Quest');
    expect(result.desc).toBe('Testing all blocks.');
    expect(result.tags).toEqual(['tag 1', 'tag 2']);
    expect(result.sections.length).toBe(1);
    expect(result.sections[0]!.name).toBe('All Blocks');
  });
});

describe('Obsidian resource link conversion', () => {
  it('should convert obsidian image links to standard markdown', () => {
    const markdown = `# Quest: Image Test
id: img-test

test para ![[set_union.svg]] and ![[foo.JPG]] and ![[bar.png]] and ![[baz.jpeg]]`;
    const result = convertObsidianLinks(markdown);
    expect(result).toContain('![set_union](/assets/set_union.svg)');
    expect(result).toContain('![foo](/assets/foo.JPG)');
    expect(result).toContain('![bar](/assets/bar.png)');
    expect(result).toContain('![baz](/assets/baz.jpeg)');
  });

  it('should remove subpath and url-encode', () => {
    const markdown = `# Quest: Subpath
id: subpath

![[folder/my image 1.svg]] ![[sub/中文图片.png]]`;
    const result = convertObsidianLinks(markdown);
    expect(result).toContain('![my image 1](/assets/my%20image%201.svg)');
    expect(result).toContain('![中文图片](/assets/%E4%B8%AD%E6%96%87%E5%9B%BE%E7%89%87.png)');
  });

  it('should not convert in code block or inline code', () => {
    const markdown = `# Quest: Code
id: code

\`\`\`
![[foo.png]]
\`\`\`

This is \`![[bar.jpg]]\` and ![[baz.svg]]`;
    const result = convertObsidianLinks(markdown);
    expect(result).toContain('```\n![[foo.png]]\n```');
    expect(result).toContain('`![[bar.jpg]]`');
    expect(result).toContain('![baz](/assets/baz.svg)');
  });

  it('should not convert non-image obsidian links', () => {
    const markdown = `# Quest: Not Image
id: not-img

![[foo.pdf]] ![[bar.txt]]`;
    const result = convertObsidianLinks(markdown);
    expect(result).toContain('![[foo.pdf]]');
    expect(result).toContain('![[bar.txt]]');
  });
});
