import { prisma } from "@/lib/prisma";

/**
 * Retrieval over the admin-managed knowledge base.
 *
 * The free-tier model provider has no embeddings endpoint, so retrieval is
 * deterministic keyword scoring instead of a vector search. That keeps the
 * assistant grounded, free and explainable: an answer is only ever built from
 * rows an administrator approved.
 */

export interface KnowledgeRow {
    id: string;
    category: string;
    question: string;
    answer: string;
    keywords: string[];
    priority: number;
}

const CACHE_TTL_MS = 60 * 1000;
const MAX_ENTRIES_IN_PROMPT = 6;

let cache: { rows: KnowledgeRow[]; builtAt: number } | null = null;

const STOP_WORDS = new Set([
    "a", "an", "the", "is", "are", "was", "were", "do", "does", "did", "can", "could",
    "i", "we", "you", "my", "our", "your", "me", "us", "it", "this", "that", "these",
    "of", "for", "to", "in", "on", "at", "by", "with", "and", "or", "but", "if", "so",
    "how", "what", "when", "where", "which", "who", "why", "please", "tell", "want",
    "need", "any", "there", "have", "has", "about", "from", "be", "been", "will", "would",
]);

function tokenize(value: string): string[] {
    return value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function parseKeywords(raw: string | null): string[] {
    if (!raw) return [];
    return raw
        .split(/[,\n;]+/)
        .map((keyword) => keyword.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 40);
}

async function loadRows(): Promise<KnowledgeRow[]> {
    try {
        const rows = await prisma.knowledgeEntry.findMany({
            where: { isActive: true },
            orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
            select: {
                id: true,
                category: true,
                question: true,
                answer: true,
                keywords: true,
                priority: true,
            },
        });

        return rows.map((row) => ({
            id: row.id,
            category: row.category,
            question: row.question,
            answer: row.answer,
            keywords: parseKeywords(row.keywords),
            priority: row.priority ?? 0,
        }));
    } catch (error) {
        // The assistant must keep working with its built-in context if the
        // knowledge table is unavailable.
        console.warn("Knowledge base unavailable:", error instanceof Error ? error.message : error);
        return [];
    }
}

async function getRows(): Promise<KnowledgeRow[]> {
    if (cache && Date.now() - cache.builtAt < CACHE_TTL_MS) return cache.rows;
    const rows = await loadRows();
    cache = { rows, builtAt: Date.now() };
    return rows;
}

/** Called after an admin creates, edits, deletes or toggles an entry. */
export function invalidateKnowledgeCache(): void {
    cache = null;
}

/**
 * Scores every approved entry against the visitor's message and returns the
 * best matches. Ties are broken by the admin-set priority, so important FAQs
 * win without hard-coding them.
 */
export async function retrieveKnowledge(query: string, limit = MAX_ENTRIES_IN_PROMPT): Promise<KnowledgeRow[]> {
    const rows = await getRows();
    if (rows.length === 0) return [];

    const queryTokens = new Set(tokenize(query ?? ""));
    if (queryTokens.size === 0) return [];

    const scored = rows.map((row) => {
        const questionTokens = tokenize(row.question);
        const keywordTokens = new Set(row.keywords.flatMap(tokenize));
        const answerTokens = new Set(tokenize(row.answer));

        let score = 0;
        for (const token of questionTokens) {
            if (queryTokens.has(token)) score += 3;
        }
        for (const token of queryTokens) {
            if (keywordTokens.has(token)) score += 4;
            else if (answerTokens.has(token)) score += 1;
        }

        // Whole-phrase keyword hits are the strongest signal ("free installation").
        for (const keyword of row.keywords) {
            if (keyword.includes(" ") && query.toLowerCase().includes(keyword)) score += 6;
        }

        return { row, score: score + Math.max(0, row.priority) * 0.1 };
    });

    return scored
        .filter((item) => item.score >= 3)
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.max(1, Math.min(limit, MAX_ENTRIES_IN_PROMPT)))
        .map((item) => item.row);
}

/** Formats retrieved rows for inclusion in the assistant's system prompt. */
export function formatKnowledge(rows: KnowledgeRow[]): string {
    if (rows.length === 0) return "";

    return [
        "",
        "APPROVED FAQ ANSWERS (maintained by the Airlink team; use these before anything else)",
        ...rows.map(
            (row) =>
                `Q: ${row.question}\nA: ${row.answer}${row.category ? `\nCategory: ${row.category}` : ""}`
        ),
    ].join("\n\n");
}
