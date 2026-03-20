let deepSeekBackoffUntil = 0;

const getDeepSeekConfig = () => ({
  apiKey: String(process.env.DEEPSEEK_API_KEY || '').trim(),
  baseUrl: String(process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').trim().replace(/\/$/, ''),
  model: String(process.env.DEEPSEEK_MODEL || 'deepseek-chat').trim(),
  timeoutMs: Number(process.env.DEEPSEEK_TIMEOUT_MS || 25000)
});

const isDeepSeekEnabled = () => Boolean(getDeepSeekConfig().apiKey && getDeepSeekConfig().model);

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

const createChatCompletion = async ({
  messages,
  temperature = 0.4,
  maxTokens = 900,
  responseFormat = null
}) => {
  const config = getDeepSeekConfig();
  if (!config.apiKey || !config.model) return null;
  if (Date.now() < deepSeekBackoffUntil) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
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
        deepSeekBackoffUntil = Date.now() + getRetryDelayMs(response, errorText);
      }
      throw new Error(`DeepSeek API error: ${errorText || response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

const createTextReply = async ({ systemPrompt, userPrompt, temperature = 0.4, maxTokens = 900 }) => {
  const payload = await createChatCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature,
    maxTokens
  });

  return getAssistantContent(payload) || null;
};

const createJsonReply = async ({ systemPrompt, userPrompt, temperature = 0.2, maxTokens = 1200 }) => {
  const payload = await createChatCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature,
    maxTokens,
    responseFormat: { type: 'json_object' }
  });

  const content = getAssistantContent(payload);
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
};

module.exports = {
  createJsonReply,
  createTextReply,
  isDeepSeekEnabled
};
