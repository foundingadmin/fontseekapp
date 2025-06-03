import { jsPDF } from "jspdf";
import type { FontData, UserScores } from "../types";
import { getDisplayName } from './aestheticStyles';

interface GeneratePDFOptions {
  font: FontData;
  scores: UserScores;
  traits: string[];
}

export function generateFontReport({ font, scores, traits }: GeneratePDFOptions) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - (margin * 2);

  // Helper for vertical spacing
  let y = margin;

  // Title
  doc.setFontSize(32);
  doc.setTextColor(0, 0, 0);
  doc.text("FontSeek Report", margin, y);
  y += 60;

  // Font Name & Style
  doc.setFontSize(24);
  doc.text(font.name, margin, y);
  y += 20;
  doc.setFontSize(18);
  doc.text(getDisplayName(font.aestheticStyle), margin, y);
  y += 40;

  // Trait badges
  doc.setFontSize(12);
  doc.setTextColor(67, 218, 122); // emerald-500
  traits.forEach((trait, i) => {
    doc.text(`• ${trait}`, margin + (i * 100), y);
  });
  y += 40;

  // Personality Profile
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("Font Personality Profile", margin, y);
  y += 30;

  // Trait bars
  const traits_data = [
    { name: "Tone", value: scores.tone, left: "Formal", right: "Casual" },
    { name: "Energy", value: scores.energy, left: "Calm", right: "Energetic" },
    { name: "Design", value: scores.design, left: "Minimal", right: "Expressive" },
    { name: "Era", value: scores.era, left: "Classic", right: "Modern" },
    { name: "Structure", value: scores.structure, left: "Organic", right: "Geometric" }
  ];

  traits_data.forEach((trait) => {
    // Trait name and labels
    doc.setFontSize(12);
    doc.text(trait.name, margin, y);
    doc.setTextColor(128, 128, 128);
    doc.text(trait.left, margin + 80, y);
    doc.text(trait.right, margin + 280, y);
    
    // Bar background
    doc.setFillColor(240, 240, 240);
    doc.rect(margin + 80, y + 10, 200, 6, "F");
    
    // Progress bar
    doc.setFillColor(67, 218, 122);
    doc.rect(margin + 80, y + 10, (trait.value / 5) * 200, 6, "F");
    
    doc.setTextColor(0, 0, 0);
    y += 40;
  });

  y += 20;

  // Implementation Section
  doc.setFontSize(18);
  doc.text("How to Use This Font", margin, y);
  y += 30;

  // HTML Code
  doc.setFontSize(12);
  doc.setTextColor(128, 128, 128);
  doc.text("Add to your HTML <head>:", margin, y);
  y += 20;

  const htmlCode = `<link href="https://fonts.googleapis.com/css2?family=${font.name.replace(/ /g, "+")}:wght@400;500;700&display=swap" rel="stylesheet">`;
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, contentWidth, 30, "F");
  doc.setTextColor(0, 0, 0);
  doc.text(htmlCode, margin + 10, y + 20);
  y += 50;

  // CSS Code
  doc.setTextColor(128, 128, 128);
  doc.text("Use in your CSS:", margin, y);
  y += 20;

  const cssCode = `font-family: '${font.name}', ${font.embedCode.split(",").slice(1).join(",")}`;
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, contentWidth, 30, "F");
  doc.setTextColor(0, 0, 0);
  doc.text(cssCode, margin + 10, y + 20);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - margin;
  doc.setFillColor(67, 218, 122);
  doc.rect(0, footerY - 80, pageWidth, 80, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text("Ready to take your brand further?", margin, footerY - 50);
  
  doc.setFontSize(14);
  doc.text("Visit foundingcreative.com", margin, footerY - 25);
  doc.text("Or email us at admin@foundingcreative.com", margin, footerY - 10);

  return doc;
}