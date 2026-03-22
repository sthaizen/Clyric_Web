const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function getProblems(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.difficulty) query.append("difficulty", params.difficulty);
  if (params.category) query.append("category", params.category);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.sort) query.append("sort", params.sort);

  const response = await fetch(`${API_URL}/problems?${query.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch problems");
  }
  return response.json();
}

export async function getProblemBySlug(slug) {
  const response = await fetch(`${API_URL}/problems/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch problem details");
  }
  return response.json();
}

export async function getTopicMetadata() {
  const response = await fetch(`${API_URL}/problems/meta/topics`);
  if (!response.ok) {
    throw new Error("Failed to fetch topic metadata");
  }
  return response.json();
}

export async function getUserSubmissions(slug, token) {
  const response = await fetch(`${API_URL}/submissions/${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch submissions");
  }
  return response.json();
}
