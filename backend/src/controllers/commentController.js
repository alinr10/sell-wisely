import puppeteer from 'puppeteer';
import AnalyzesModel from '../models/analyzes.js';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBDZkg7YqztWK3RFuMn4BoCy5xOZG814Go");

const run = async (items) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  console.log(items, "ittteee")
  const prompt = `${items} bu yorumların hepsine bakarak genel bir analiz yazısı yaz.`

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
  console.log(text);
}

const analyze = async (req, res) => {
  const { url, creatorID } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2' });

    const { reviews, productName } = await page.evaluate(() => {
      const reviewElements = document.querySelectorAll('li.comment');
      const uniqueReviews = new Set();

      reviewElements.forEach(element => {
        const text = element.querySelector('p').textContent.trim();
        uniqueReviews.add(text);
      });

      const productNameElement = document.querySelector('div.unf-p-summary-title');
      const productName = productNameElement ? productNameElement.textContent.trim() : 'Product name not found';

      return { reviews: Array.from(uniqueReviews), productName };
    });

    await browser.close();

    let result = await run(reviews);

    await addAnalyzes(productName, url, reviews, result, creatorID);

    res.json({ productName, reviews, result });

  } catch (error) {
    console.error('Error fetching reviews and product name:', error);
    res.status(500).json({ error: 'Failed to fetch reviews and product name' });
  }
};

const addAnalyzes = async (productName, url, reviews, result, creatorID) => {
  try {
    await AnalyzesModel.create({
      productName: productName,
      productUrl: url,
      productComments: reviews,
      result: result,
      creatorID: creatorID
    });

    console.log('Analyze registered successfully');
  } catch (error) {
    console.error('Error saving analyze:', error);
    throw new Error('Server error');
  }
};



const getAnalyzes = async (req, res) => {
  const { creatorID } = req.query;

  try {
    // Debugging: Log the creatorID to ensure it's correct
    console.log('Fetching analyses for creatorID:', creatorID);

    const analyses = await AnalyzesModel.find({ creatorID: creatorID }).select('productName result creatorID').lean();

    // Debugging: Log the fetched analyses to verify the query results
    console.log('Fetched analyses:', analyses);

    res.status(200).json({ analyses });
  } catch (error) {
    console.error('Error fetching previous analyses:', error);
    res.status(500).json({ error: 'Failed to fetch previous analyses' });
  }
};


export { analyze, getAnalyzes }