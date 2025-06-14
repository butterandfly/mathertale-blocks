import { marked, type Token } from 'marked';

import { convertContradictionMarkdown } from './blocks/contradiction-block';
import {
  convertFactMarkdown,
  convertLemmaMarkdown,
  convertPropositionMarkdown,
  convertRemarkMarkdown,
  convertTheoremMarkdown,
} from './blocks/noted-block';
import { convertDefinitionMarkdown } from './blocks/noted-block';
import { convertParaMarkdown } from './blocks/para-block';
import { convertProofReorderMarkdown } from './blocks/proof-reorder-block';
import { convertSingleChoiceMarkdown } from './blocks/single-choice-block';
import { type MarkdownBlock, parseQuestHeader } from './convert-markdown-helper';
import { type BlockSchema, type QuestSchema, type SectionSchema, Category } from './schemas';
import { convertSelectionMarkdown } from './blocks/selection-block';
// 定义转换函数的类型
type ConvertFunction = (block: MarkdownBlock) => BlockSchema;

// 转换函数映射表
const convertBlockMap: Record<string, ConvertFunction> = {
  para: convertParaMarkdown,
  definition: convertDefinitionMarkdown,
  fact: convertFactMarkdown,
  theorem: convertTheoremMarkdown,
  proposition: convertPropositionMarkdown,
  remark: convertRemarkMarkdown,
  lemma: convertLemmaMarkdown,
  single_choice: convertSingleChoiceMarkdown,
  proof_reorder: convertProofReorderMarkdown,
  contradiction: convertContradictionMarkdown,
  selection: convertSelectionMarkdown,
};

interface MarkdownSection {
  name: string;
  blocks: MarkdownBlock[];
}

interface MarkdownQuest {
  name: string;
  id: string;
  desc: string;
  sections: MarkdownSection[];
  category?: string;
  tags?: string[];
}

/**
 * 将 Obsidian 资源链接（![[xxx.svg]]）转为标准 markdown 图片链接
 * 只处理 svg/png/jpg/jpeg，忽略代码块和行内代码，去掉子路径，资源名转url可用
 */
export function convertObsidianLinks(text: string): string {
  // 先分割代码块和行内代码，避免替换
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  const inlineCodeRegex = /(`[^`]*`)/g;
  const codeBlocks: string[] = [];
  const inlineCodes: string[] = [];
  let replaced = text
    .replace(codeBlockRegex, (m) => {
      codeBlocks.push(m);
      return `{{CODEBLOCK_${codeBlocks.length - 1}}}`;
    })
    .replace(inlineCodeRegex, (m) => {
      inlineCodes.push(m);
      return `{{INLINECODE_${inlineCodes.length - 1}}}`;
    });

  // 只替换svg/png/jpg/jpeg（不区分大小写）
  replaced = replaced.replace(/!\[\[([^\]]+\.(svg|png|jpe?g))\]\]/gi, (_, filename) => {
    // 去掉子路径
    const base = filename.split(/[\\/]/).pop()!;
    // alt为无扩展名
    const alt = base.replace(/\.[^.]+$/, '');
    // url编码
    const url = encodeURIComponent(base);
    return `![${alt}](/assets/${url})`;
  });

  // 还原行内代码和代码块
  replaced = replaced
    .replace(/\{\{INLINECODE_(\d+)\}\}/g, (_, i) => inlineCodes[Number(i)] || '')
    .replace(/\{\{CODEBLOCK_(\d+)\}\}/g, (_, i) => codeBlocks[Number(i)] || '');
  return replaced;
}

/**
 * 解析markdown并转换为Quest对象
 * @param markdown markdown内容
 * @returns 解析后的Quest对象
 */
function parseMarkdownQuest(markdown: string): MarkdownQuest {
  // 先处理 Obsidian 资源链接
  markdown = convertObsidianLinks(markdown);
  const tokens = marked.lexer(markdown);
  let currentSection: MarkdownSection | null = null;

  const quest: MarkdownQuest = {
    name: '',
    id: '',
    desc: '',
    sections: [],
  };

  // 第一步：获取Quest标题信息
  const headerInfo = parseQuestHeader(tokens);
  quest.name = headerInfo['name'] || '';
  quest.id = headerInfo['id'] || '';
  quest.desc = headerInfo['desc'] || '';
  if (headerInfo['category']) {
    quest.category = headerInfo['category'];
  }
  if (headerInfo['tags']) {
    quest.tags = headerInfo['tags'].split(',').map((tag) => tag.trim());
  }

  // 第二步：处理sections和blocks
  let blockTokens: Token[] = [];
  let currentBlockTag = '';
  let currentBlockName = '';
  let currentBlockId = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;

    if (token.type === 'heading') {
      // 新的section
      if (token.depth === 2) {
        // 保存上一个block（如果存在）
        if (blockTokens.length > 0 && currentSection) {
          currentSection.blocks.push({
            tag: currentBlockTag,
            name: currentBlockName || undefined,
            id: currentBlockId,
            rawTokens: blockTokens,
          });
        }

        if (currentSection) {
          quest.sections.push(currentSection);
        }

        const sectionName = token.text.replace(/^Section:\s*/, '').trim();
        currentSection = {
          name: sectionName,
          blocks: [],
        };
        blockTokens = [];
        currentBlockTag = '';
        currentBlockName = '';
        currentBlockId = '';
      }
      // 新的block
      else if (token.depth === 3 && token.text.includes(':')) {
        // 保存上一个block（如果存在）
        if (blockTokens.length > 0 && currentSection) {
          currentSection.blocks.push({
            tag: currentBlockTag,
            name: currentBlockName || undefined,
            id: currentBlockId,
            rawTokens: blockTokens,
          });
        }

        const [tag, name] = token.text.split(':').map((s: string) => s.trim());
        currentBlockTag = tag.toLowerCase();
        currentBlockName = name;
        currentBlockId = ''; // 当遇到id元数据时设置

        blockTokens = [];
      }
      // 保留h4标题，它们是block的一部分
      else if (token.depth >= 4) {
        blockTokens.push(token);
      }
    } else if (token.type === 'paragraph' && token.text.startsWith('id:')) {
      // 只处理block的id，不影响quest的id
      currentBlockId = token.text.substring('id:'.length).trim();
    } else {
      blockTokens.push(token);
    }
  }

  // 保存最后一个block和section
  if (currentSection && blockTokens.length > 0) {
    currentSection.blocks.push({
      tag: currentBlockTag,
      name: currentBlockName || undefined,
      id: currentBlockId,
      rawTokens: blockTokens,
    });
    quest.sections.push(currentSection);
  }

  // 确保Quest ID不被覆盖
  const originalId = headerInfo['id'];
  if (originalId && originalId !== quest.id) {
    quest.id = originalId;
  }

  return quest;
}

/**
 * 验证每个block都有ID
 * @param quest 解析后的Quest对象
 * @throws 如果有block没有ID则抛出错误
 */
function validateBlockIds(quest: MarkdownQuest): void {
  quest.sections.forEach((section, sectionIndex) => {
    section.blocks.forEach((block, blockIndex) => {
      if (!block.id || block.id.trim() === '') {
        const errorInfo = {
          questName: quest.name,
          questId: quest.id,
          sectionName: section.name,
          sectionIndex,
          blockTag: block.tag,
          blockName: block.name || '(unnamed)',
          blockIndex,
        };

        throw new Error(
          `Block ID is missing! Details: ${JSON.stringify(errorInfo, null, 2)}\n` +
            `This block appears in section "${section.name}" at position ${blockIndex + 1}`,
        );
      }
    });
  });
}

/**
 * 注册block转换函数
 * @param tag block类型
 * @param converter 转换函数
 */
export function registerBlockConverter(tag: string, converter: ConvertFunction): void {
  convertBlockMap[tag] = converter;
}

/**
 * 将markdown转换为Quest对象
 * @param markdown markdown内容
 * @returns 转换后的Quest对象
 */
export function convertQuestMarkdown(markdown: string): QuestSchema {
  const parsedQuest = parseMarkdownQuest(markdown);

  // 验证所有block都有ID
  validateBlockIds(parsedQuest);

  const quest: QuestSchema = {
    id: parsedQuest.id,
    name: parsedQuest.name,
    desc: parsedQuest.desc,
    category: parsedQuest.category as Category,
    tags: parsedQuest.tags,
    blockCount: 0,
    sections: [],
    updatedAt: new Date(),
    dependentQuests: [],
    childQuests: [],
  };

  quest.sections = parsedQuest.sections.map((section) => {
    const convertedSection: SectionSchema = {
      name: section.name,
      blocks: section.blocks.map((block) => {
        const converter = convertBlockMap[block.tag];
        if (!converter) {
          throw new Error(`No converter registered for block type: ${block.tag}`);
        }

        return converter(block);
      }),
    };
    return convertedSection;
  });

  quest.blockCount = quest.sections.reduce((count, section) => count + section.blocks.length, 0);

  return quest;
}
