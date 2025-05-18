import { existsSync, readFileSync, rmSync } from 'fs';
import path from 'path';

import { describe, it, expect, beforeEach } from 'vitest';

import { buildAllSoloQuestData } from './build-data';
import { type SoloQuestShortSchema } from '../lib/core/schemas';

const testDataDir = './test_data';

describe('buildAllSoloQuestData', () => {
  beforeEach(() => {
    if (existsSync(testDataDir + '/output/soloquests')) {
      rmSync(testDataDir + '/output/soloquests', { recursive: true });
    }
  });

  it('should build solo quest data correctly', () => {
    buildAllSoloQuestData(testDataDir, testDataDir + '/output');

    // Check soloquests.json
    const soloquestsData = readFileSync(testDataDir + '/output/soloquests/soloquests.json', 'utf8');
    const soloquests = JSON.parse(soloquestsData);
    expect(soloquests.length).toBeGreaterThan(0);

    // Check if individual solo quest files are created
    soloquests.forEach((soloquest: SoloQuestShortSchema) => {
      const soloquestPath = path.join(testDataDir + '/output/soloquests', `soloquest-${soloquest.id}.json`);
      expect(existsSync(soloquestPath)).toBeTruthy();

      const soloquestData = JSON.parse(readFileSync(soloquestPath, 'utf8'));
      expect(soloquestData.id).toEqual(soloquest.id);
    });
  });
});
