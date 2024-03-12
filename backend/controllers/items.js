// backend/controllers/itemsController.js
import Item from "../model/item.js";
import asyncWrapper from "../middleware/asyncWrapper.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getItems = asyncWrapper(async (req, res) => {
  const items = await Item.find();
  res.status(200).json({ items });
});

export const addItem = asyncWrapper(async (req, res) => {
  const { semester, subject, year } = req.body;
  const file = req.file.path;
  const item = await Item.create({ file, semester, subject, year });
  res.status(201).json({ item });
});

export const addAnswer = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const answerFile = req.file.path;
  const item = await Item.findByIdAndUpdate(id, { answerFile }, { new: true });
  res.status(200).json({ item });
});

export const getUserItems = asyncWrapper(async (req, res) => {
  const { semester, subject } = req.params;
  const items = await Item.find({ semester, subject });
  res.status(200).json({ items });
});

export const downloadFile = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ error: "No item found" });
  }
  const file = item.file;
  const filePath = join(__dirname, '..', file);
  res.download(filePath);
});

export const downloadAnswerFile = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (!item || !item.answerFile) {
    return res.status(404).json({ error: "No answer file found" });
  }
  const answerFile = item.answerFile;
  const filePath = join(__dirname, '..', answerFile);
  res.download(filePath);
});
