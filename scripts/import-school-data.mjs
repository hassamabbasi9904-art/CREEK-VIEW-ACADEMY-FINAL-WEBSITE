#!/usr/bin/env node
import nextEnv from '@next/env';
import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectToMongoDB } from '../lib/mongodb.mjs';
import {
  DiaryModel,
  SchoolMetadataModel,
  StudentModel,
  TeacherModel,
} from '../lib/models.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceFile = path.join(projectRoot, 'data', 'school_database.json');
const { loadEnvConfig } = nextEnv;

function readSource() {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read valid JSON from ${sourceFile}: ${error.message}`);
  }

  for (const key of ['teachers', 'students', 'diaries']) {
    if (!Array.isArray(data[key])) {
      throw new Error(`Expected "${key}" to be an array in ${sourceFile}.`);
    }
    const ids = data[key].map((record) => record?.id);
    if (ids.some((id) => typeof id !== 'string' || !id.trim())) {
      throw new Error(`Every record in "${key}" must have a non-empty string id.`);
    }
    if (new Set(ids).size !== ids.length) {
      throw new Error(`Duplicate ids found in "${key}" in ${sourceFile}.`);
    }
  }
  if (typeof data.lastPurgedAt !== 'string') {
    throw new Error(`Expected "lastPurgedAt" to be a string in ${sourceFile}.`);
  }

  return data;
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonical(value[key])]),
    );
  }
  return value;
}

function sameRecord(source, stored) {
  const { _id, __v, ...record } = stored;
  return JSON.stringify(canonical(source)) === JSON.stringify(canonical(record));
}

async function importRecords(label, Model, records) {
  const beforeCount = await Model.countDocuments();
  if (records.length) {
    await Model.init();
    const result = await Model.bulkWrite(records.map((record) => ({
      updateOne: {
        filter: { id: record.id },
        update: { $setOnInsert: record },
        upsert: true,
      },
    })), { ordered: false });

    const expectedSamples = [records[0], records[records.length - 1]];
    const storedSamples = await Model.find({
      id: { $in: [...new Set(expectedSamples.map((record) => record.id))] },
    }).lean();
    for (const expected of expectedSamples) {
      const stored = storedSamples.find((record) => record.id === expected.id);
      if (!stored || !sameRecord(expected, stored)) {
        throw new Error(
          `Verification failed for ${label} record "${expected.id}". Existing records were not overwritten.`,
        );
      }
    }

    const documentCount = await Model.countDocuments();
    return {
      imported: result.upsertedCount,
      alreadyPresent: records.length - result.upsertedCount,
      documentCount,
      beforeCount,
    };
  }

  return {
    imported: 0,
    alreadyPresent: 0,
    documentCount: beforeCount,
    beforeCount,
  };
}

async function importMetadata(lastPurgedAt) {
  const beforeCount = await SchoolMetadataModel.countDocuments();
  const alreadyPresent = Boolean(await SchoolMetadataModel.exists({ _id: 'school-state' }));
  await SchoolMetadataModel.updateOne(
    { _id: 'school-state' },
    { $setOnInsert: { lastPurgedAt } },
    { upsert: true },
  );
  const stored = await SchoolMetadataModel.findById('school-state').lean();
  if (!stored || stored.lastPurgedAt !== lastPurgedAt) {
    throw new Error('Verification failed for school metadata. Existing metadata was not overwritten.');
  }
  return {
    imported: alreadyPresent ? 0 : 1,
    alreadyPresent: alreadyPresent ? 1 : 0,
    documentCount: await SchoolMetadataModel.countDocuments(),
    beforeCount,
  };
}

function report(label, result) {
  console.log(
    `${label}: imported ${result.imported}; already present ${result.alreadyPresent}; ` +
    `collection total ${result.documentCount} (was ${result.beforeCount}); verification passed`,
  );
}

async function main() {
  loadEnvConfig(projectRoot);
  const source = readSource();

  try {
    await connectToMongoDB();
    report('teachers', await importRecords('teachers', TeacherModel, source.teachers));
    report('students', await importRecords('students', StudentModel, source.students));
    report('diaries', await importRecords('diaries', DiaryModel, source.diaries));
    report('school_metadata', await importMetadata(source.lastPurgedAt));
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  const uri = process.env.MONGODB_URI;
  let message = error instanceof Error ? error.message : String(error);
  if (uri) message = message.split(uri).join('[redacted MongoDB URI]');
  console.error(`School data import failed: ${message}`);
  process.exitCode = 1;
});
