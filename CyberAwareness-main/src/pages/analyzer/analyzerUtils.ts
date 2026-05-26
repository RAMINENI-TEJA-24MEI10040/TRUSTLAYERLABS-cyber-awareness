import { buildKnowledgeContext, searchKnowledgeBase } from "../../ai-assistant/knowledgeBase";
import { groqChat } from "../../ai-assistant/groqClient";
import { detectScam, type ScamSignal } from "../../ai-assistant/heuristics";
import type { AnalysisResult } from "./types";

export function getRiskLabel(score: number) {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

export async function analyzeScamText(text: string): Promise<AnalysisResult> {
  const message = text.trim();
  const signal = detectScam(message);

  if (!signal) {
    return {
      risk: "Low",
      score: 0,
      category: "No threat detected",
      confidence: 12,
      indicators: [],
      suspiciousUrls: [],
      recommendation: "No suspicious scam signals were detected. Stay cautious and verify sender authenticity.",
      explanation: "This message does not contain strong scam indicators based on heuristic analysis.",
    };
  }

  const risk = getRiskLabel(signal.score);
  const confidence = Math.round(signal.confidence * 100);
  const recommendation =
    signal.score >= 40
      ? "Avoid interacting with this message. Do not click links, share OTPs, or approve requests from unknown contacts."
      : "Proceed with caution and verify the sender before responding.";
  const explanation = await generateAiExplanation(message, signal);

  return {
    risk,
    score: signal.score,
    category: signal.category,
    confidence,
    indicators: signal.indicators,
    suspiciousUrls: signal.suspiciousUrls,
    recommendation,
    explanation,
  };
}

export async function scanImageFile(file: File): Promise<{ text: string; note: string }> {
  try {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker({ logger: () => {} });
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const { data } = await worker.recognize(file);
    await worker.terminate();

    const text = data.text?.trim() ?? "";
    if (!text) {
      return { text: "", note: "OCR completed but no visible text was found in the screenshot." };
    }

    return { text, note: "Screenshot text extracted successfully. Review the output below." };
  } catch {
    return {
      text: "",
      note: "OCR support is unavailable. Install tesseract.js or use pasted text instead.",
    };
  }
}

async function generateAiExplanation(message: string, signal: ScamSignal): Promise<string> {
  const knowledgeContext = buildKnowledgeContext(message, "general");
  const relevantSources = searchKnowledgeBase(message, "general");
  const sourceSummary = relevantSources.length
    ? relevantSources.map((source) => `${source.title}: ${source.text}`).join("\n\n")
    : "No local knowledge match found.";

  const prompt = [
    `User message:\n${message}`,
    `Heuristic summary: ${signal.summary}.`,
    `Detected indicators: ${signal.indicators.join(", ")}.`,
    `Suspicious URLs: ${signal.suspiciousUrls.length > 0 ? signal.suspiciousUrls.join(", ") : "none"}.`,
    `Scam category: ${signal.category}.`,
    `Local knowledge: ${knowledgeContext}`,
    "Explain why this message is suspicious, identify the likely scam type, and provide one concise safety recommendation.",
  ].join("\n\n");

  try {
    const response = await groqChat(
      [
        { role: "system", content: "You are a concise cyber safety analyst." },
        { role: "user", content: prompt },
      ],
      0.65,
      220,
    );

    if (response && response.length > 0) {
      return response;
    }
  } catch {
    // Fall back to local explanation if the API is unavailable.
  }

  return buildFallbackExplanation(signal, sourceSummary);
}

function buildFallbackExplanation(signal: ScamSignal, sourceSummary: string): string {
  const lines = [
    `This appears to be a ${signal.category} with ${getRiskLabel(signal.score).toLowerCase()} risk.`,
    `Key signals: ${signal.indicators.join(", ")}.`,
  ];

  if (signal.suspiciousUrls.length > 0) {
    lines.push(`Suspicious links detected: ${signal.suspiciousUrls.join(", ")}.`);
  }

  lines.push(
    "Recommendation: Stop interacting with this message, verify the sender through official channels, and do not share sensitive data.",
  );

  if (sourceSummary) {
    lines.push(`\nLocal context summary:\n${sourceSummary}`);
  }

  return lines.join(" ");
}