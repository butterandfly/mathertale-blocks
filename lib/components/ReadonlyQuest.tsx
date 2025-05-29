import React from 'react';
import { type BaseQuestSchema, type BlockSchema, BlockStatus } from '../core/schemas';
import { type BlockRenderer, type QuestionBlockRenderer } from './components';

// Import block data types
import { ParaType } from '../core/blocks/para-block';
import {
  DefinitionType,
  TheoremType,
  PropositionType,
  RemarkType,
  LemmaType,
  FactType,
} from '../core/blocks/noted-block';
import { SingleChoiceType } from '../core/blocks/single-choice-block';
import { ProofReorderType } from '../core/blocks/proof-reorder-block';
import { ContradictionType } from '../core/blocks/contradiction-block';
import { TombstoneType } from '../core/blocks/tombstone-block';

// Import renderers
import { renderParaBlock } from './ParaBlock';
import {
  renderDefinitionBlock,
  renderTheoremBlock,
  renderPropositionBlock,
  renderRemarkBlock,
  renderLemmaBlock,
  renderFactBlock,
} from './NotedBlock';
import { renderSingleChoiceBlock } from './SingleChoiceBlock';
import { renderProofReorderBlock } from './ProofReorderBlock';
import { renderContradictionBlock } from './ContradictionBlock';
import { renderTombstoneBlock } from './TombstoneBlock';

export interface ReadonlyQuestProps {
  quest: BaseQuestSchema;
  className?: string;
}

// Map for base blocks (non-question blocks)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const baseBlockRendererMap: Record<string, BlockRenderer<any>> = {
  [ParaType]: renderParaBlock,
  [DefinitionType]: renderDefinitionBlock,
  [TheoremType]: renderTheoremBlock,
  [PropositionType]: renderPropositionBlock,
  [RemarkType]: renderRemarkBlock,
  [LemmaType]: renderLemmaBlock,
  [FactType]: renderFactBlock,
};

// Map for question blocks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const questionBlockRendererMap: Record<string, QuestionBlockRenderer<any, any>> = {
  [SingleChoiceType]: renderSingleChoiceBlock,
  [ProofReorderType]: renderProofReorderBlock,
  [ContradictionType]: renderContradictionBlock,
  [TombstoneType]: renderTombstoneBlock,
};

// Dummy async function for readonly mode (never called)
const dummyOnContinue = async () => {
  // This should never be called in readonly mode
  console.warn('onContinue called in readonly mode');
};

// Dummy async function for readonly mode (never called)
const dummyOnSubmit = async () => {
  // This should never be called in readonly mode
  console.warn('onSubmit called in readonly mode');
};

function renderBlock(block: BlockSchema): React.ReactElement | null {
  const blockType = block.type;

  // Check if it's a base block
  const baseRenderer = baseBlockRendererMap[blockType];
  if (baseRenderer) {
    return baseRenderer({
      data: block,
      status: BlockStatus.COMPLETED,
      onContinue: dummyOnContinue,
      readonly: true,
    });
  }

  // Check if it's a question block
  const questionRenderer = questionBlockRendererMap[blockType];
  if (questionRenderer) {
    return questionRenderer({
      data: block,
      status: BlockStatus.COMPLETED,
      onContinue: dummyOnContinue,
      submittedAnswer: undefined, // No submitted answer in readonly mode
      onSubmit: dummyOnSubmit,
      readonly: true,
    });
  }

  // Unsupported block type
  console.warn(`Unsupported block type: ${blockType}`);
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-yellow-800">
        Unsupported block type: <code className="font-mono">{blockType}</code>
      </p>
      <p className="text-sm text-yellow-600 mt-1">Block ID: {block.id}</p>
    </div>
  );
}

export function ReadonlyQuest({ quest, className = '' }: ReadonlyQuestProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Quest header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{quest.name}</h1>
        {quest.desc && <p className="text-lg text-gray-600">{quest.desc}</p>}
        {quest.category && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {quest.category}
          </div>
        )}
      </div>

      {/* Quest sections */}
      <div className="space-y-12">
        {quest.sections.map((section, sectionIndex) => (
          <section
            key={`section-${sectionIndex}`}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
              {section.name}
            </h2>

            <div className="space-y-6">
              {section.blocks.map((block, blockIndex) => (
                <div
                  key={`${section.name}-block-${blockIndex}-${block.id}`}
                  className="block-container"
                >
                  {renderBlock(block)}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Quest footer */}
      <div className="pt-8 border-t border-gray-200">
        <div className="text-sm text-gray-500 space-y-1">
          <p>Total blocks: {quest.blockCount}</p>
          {quest.updatedAt && <p>Last updated: {quest.updatedAt.toLocaleDateString()}</p>}
        </div>
      </div>
    </div>
  );
}
