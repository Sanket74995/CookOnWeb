const providerBackoffUntil = new Map();

const trimTrailingSlash = (value) => String(value || '').trim().replace(/\/$/, '');

const getProviders = () => ([
  {
    id: 'openrouter',
    label: 'OpenRouter',
    apiKey: String(process.env.OPENROUTER_API_KEY || '').trim(),
    baseUrl: trimTrailingSlash(process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'),
    model: String(process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini').trim(),
    timeoutMs: Number(process.env.OPENROUTER_TIMEOUT_MS || process.env.AI_TIMEOUT_MS || 25000),
    buildHeaders: () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${String(process.env.OPENROUTER_API_KEY || '').trim()}`,
      ...(process.env.OPENROUTER_SITE_URL ? { 'HTTP-Referer': String(process.env.OPENROUTER_SITE_URL).trim() } : {}),
      ...(process.env.OPENROUTER_APP_NAME ? { 'X-Title': String(process.env.OPENROUTER_APP_NAME).trim() } : {})
    })
  },
  {
    id: 'groq',
    label: 'Groq',
    apiKey: String(process.env.GROQ_API_KEY || '').trim(),
    baseUrl: trimTrailingSlash(process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'),
    model: String(process.env.GROQ_MODEL || 'llama-3.3-70b-versatile').trim(),
    timeoutMs: Number(process.env.GROQ_TIMEOUT_MS || process.env.AI_TIMEOUT_MS || 15000),
    buildHeaders: () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${String(process.env.GROQ_API_KEY || '').trim()}`
    })
  }
]).filter((provider) => provider.apiKey && provider.model);

const isAIEnabled = () => getProviders().length > 0;

const isDeepSeekEnabled = () => isAIEnabled();

const getRetryDelayMs = (response, errorText = '') => {
  const retryAfter = Number(response.headers.get('retry-after'));
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return retryAfter * 1000;
  }

  const retryMatch = String(errorText).match(/(\d+)\s*(ms|s|sec|seconds|min|minutes)/i);
  if (!retryMatch) return 60_000;

  const value = Number(retryMatch[1]);
  const unit = retryMatch[2].toLowerCase();

  if (unit === 'ms') return value;
  if (unit.startsWith('min')) return value * 60_000;
  return value * 1000;
};

const getAssistantContent = (payload) => {
  const content = payload?.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content.trim() : '';
};

const tryProviderCompletion = async (provider, {
  messages,
  temperature = 0.4,
  maxTokens = 900,
  responseFormat = null
}) => {
  if (Date.now() < (providerBackoffUntil.get(provider.id) || 0)) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), provider.timeoutMs);

  try {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: provider.buildHeaders(),
      body: JSON.stringify({
        model: provider.model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
        ...(responseFormat ? { response_format: responseFormat } : {})
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429 || response.status >= 500) {
        providerBackoffUntil.set(provider.id, Date.now() + getRetryDelayMs(response, errorText));
      }
      throw new Error(`${provider.label} API error: ${errorText || response.status}`);
    }

    providerBackoffUntil.set(provider.id, 0);
    const payload = await response.json();
    return { payload, provider: provider.id };
  } finally {
    clearTimeout(timeout);
  }
};

const createChatCompletion = async (options) => {
  const providers = getProviders();
  if (!providers.length) return null;

  const errors = [];

  for (const provider of providers) {
    try {
      const result = await tryProviderCompletion(provider, options);
      if (result?.payload) {
        return result;
      }
    } catch (error) {
      errors.push(error.message);
    }
  }

  throw new Error(errors.join(' | ') || 'No AI provider is currently available');
};

const createTextReply = async ({ systemPrompt, userPrompt, temperature = 0.4, maxTokens = 900 }) => {
  const result = await createChatCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature,
    maxTokens
  });

  return getAssistantContent(result?.payload) || null;
};

const createJsonReply = async ({ systemPrompt, userPrompt, temperature = 0.2, maxTokens = 1200 }) => {
  const result = await createChatCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature,
    maxTokens,
    responseFormat: { type: 'json_object' }
  });

  const content = getAssistantContent(result?.payload);
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
};

const getAIProviderStatus = () =>
  getProviders().map((provider) => ({
    id: provider.id,
    label: provider.label,
    model: provider.model,
    enabled: true,
    backedOffUntil: providerBackoffUntil.get(provider.id) || 0
  }));

module.exports = {
  createJsonReply,
  createTextReply,
  isAIEnabled,
  isDeepSeekEnabled,
  getAIProviderStatus
};
