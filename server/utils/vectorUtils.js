/**
 * JavaScipt implementation of Cosine Similarity for vector comparison.
 * Formula: (A . B) / (||A|| * ||B||)
 */

/**
 * Calculates dot product of two vectors
 * @param {number[]} vecA 
 * @param {number[]} vecB 
 * @returns {number}
 */
function dotProduct(vecA, vecB) {
    let product = 0;
    for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
    }
    return product;
}

/**
 * Calculates magnitude (L2 norm) of a vector
 * @param {number[]} vec 
 * @returns {number}
 */
function magnitude(vec) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}

/**
 * Calculates cosine similarity between two vectors
 * @param {number[]} vecA 
 * @param {number[]} vecB 
 * @returns {number} Similarity score (-1 to 1)
 */
function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must have same dimension");
    }
    const dot = dotProduct(vecA, vecB);
    const magA = magnitude(vecA);
    const magB = magnitude(vecB);

    if (magA === 0 || magB === 0) return 0;

    return dot / (magA * magB);
}

/**
 * Finds top K most similar vectors from a store
 * @param {number[]} queryVector 
 * @param {Array<{id: string, text: string, embedding: number[]}>} store 
 * @param {number} k 
 * @returns {Array<{item: Object, score: number}>}
 */
function findNearestNeighbors(queryVector, store, k = 3) {
    const scoredParams = store.map(item => ({
        item,
        score: cosineSimilarity(queryVector, item.embedding)
    }));

    // Sort by score descending
    scoredParams.sort((a, b) => b.score - a.score);

    return scoredParams.slice(0, k);
}

module.exports = {
    cosineSimilarity,
    findNearestNeighbors
};
