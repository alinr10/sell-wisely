import OrderModel from '../models/Order.js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyBDZkg7YqztWK3RFuMn4BoCy5xOZG814Go";
const genAI = new GoogleGenerativeAI(API_KEY);



const run = async (menuItems) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Her bir siparişin adını içeren bir dizi oluştur
  const orderNames = menuItems.map((item) => item.name);

  // AI'ya sormak üzere bir metin oluştur
  const prompt = `Bir müşterinin verdiği geçmiş siparişler şunlardır: ${orderNames.join(', ')}. Bu müşterinin önceki yemek siparişleridir. Bu yemeklere benzer vereceğim yemek listesinden bir tane yemek önerisi yap öneri yaparken sadece yemeğin ismini ver başka bir şey yazma. yemek listesi :  [Kumpir, İskender, Adana Kebap, Lahmacun, Hünkar Beğendi, Ali Nazik Kebabı, Baklava, Balık Tava, Beyti Kebap, Börek, Ciğer Sote, Çiğ Köfte, Çılbır, Tavuk Döner, Fırın Makarna, Fırın Tavuk, Hamsi Tava, Havuç Tarator, İmam Bayıldı, İskilip Dolması, İslim Kebap, Ispanaklı karnabahar, Kadayıf, Karides Güveç, Karnabahar Kızartması, Kavurmalı Pilav, Kısır, Kuzu Güveç, Kuzu İncik, Kuzu Kelle Paça Çorbası, Kuzu Tandır, Künefe, Mantı, Mercimek Çorbası, Muhammara, Paçanga Böreği, Patlıcan Kebabı, Patso, Pide, Samsun Bafra Pidesi, Simit, Şiş Kebap, Tavuklu Kaşarlı Tost, Tavuklu Pilav, Zeytinyağlı Yaprak Sarma]`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
};





export { }