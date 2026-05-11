const fs = require('fs');
let code = fs.readFileSync('prisma/seed.ts', 'utf8');

// Replace upstreamName with upstreamModel
code = code.replace(/upstreamName:/g, 'upstreamModel:');
// Replace multipliers with rates
code = code.replace(/inputCreditMultiplier:/g, 'inputCreditRate:');
code = code.replace(/outputCreditMultiplier:/g, 'outputCreditRate:');
// Remove cacheCreditMultiplier
code = code.replace(/\s*cacheCreditMultiplier:.*,/g, '');

// Now we need to add provider fetching and assignment
const providerCode = `
  let codexProvider = await prisma.aiProvider.findFirst({ where: { apiFamily: 'CODEXAI' } });
  if (!codexProvider) codexProvider = await prisma.aiProvider.create({ data: { name: 'CodeXAI', apiFamily: 'CODEXAI', baseUrl: 'https://api.openai.com/v1', encryptedApiKey: 'dummy' } });

  let claudeProvider = await prisma.aiProvider.findFirst({ where: { apiFamily: 'CLAUDE' } });
  if (!claudeProvider) claudeProvider = await prisma.aiProvider.create({ data: { name: 'Claude', apiFamily: 'CLAUDE', baseUrl: 'https://api.anthropic.com', encryptedApiKey: 'dummy' } });

  let geminiProvider = await prisma.aiProvider.findFirst({ where: { apiFamily: 'GEMINI' } });
  if (!geminiProvider) geminiProvider = await prisma.aiProvider.create({ data: { name: 'Gemini', apiFamily: 'GEMINI', baseUrl: 'https://generativelanguage.googleapis.com', encryptedApiKey: 'dummy' } });

  let deepseekProvider = await prisma.aiProvider.findFirst({ where: { apiFamily: 'DEEPSEEK' } });
  if (!deepseekProvider) deepseekProvider = await prisma.aiProvider.create({ data: { name: 'DeepSeek', apiFamily: 'DEEPSEEK', baseUrl: 'https://api.deepseek.com', encryptedApiKey: 'dummy' } });

  const providers = {
    CODEXAI: codexProvider.id,
    CLAUDE: claudeProvider.id,
    GEMINI: geminiProvider.id,
    DEEPSEEK: deepseekProvider.id,
  };
`;

// Insert provider code at the start of seedModels
code = code.replace('async function seedModels() {', 'async function seedModels() {' + providerCode);

// Add providerId to models
code = code.replace(/apiFamily: "CODEXAI" as any,/g, 'apiFamily: "CODEXAI" as any,\n      providerId: providers.CODEXAI,');
code = code.replace(/apiFamily: "CLAUDE" as any,/g, 'apiFamily: "CLAUDE" as any,\n      providerId: providers.CLAUDE,');
code = code.replace(/apiFamily: "GEMINI" as any,/g, 'apiFamily: "GEMINI" as any,\n      providerId: providers.GEMINI,');
code = code.replace(/apiFamily: "DEEPSEEK" as any,/g, 'apiFamily: "DEEPSEEK" as any,\n      providerId: providers.DEEPSEEK,');

// Float to Int
code = code.replace(/inputCreditRate: 0.33/g, 'inputCreditRate: 1');
code = code.replace(/outputCreditRate: 0.33/g, 'outputCreditRate: 1');
code = code.replace(/inputCreditRate: 1.3/g, 'inputCreditRate: 1');
code = code.replace(/outputCreditRate: 1.3/g, 'outputCreditRate: 1');
code = code.replace(/inputCreditRate: 1.67/g, 'inputCreditRate: 2');
code = code.replace(/outputCreditRate: 1.67/g, 'outputCreditRate: 2');
code = code.replace(/inputCreditRate: 0.5/g, 'inputCreditRate: 1');
code = code.replace(/outputCreditRate: 0.5/g, 'outputCreditRate: 1');

fs.writeFileSync('prisma/seed.ts', code);
