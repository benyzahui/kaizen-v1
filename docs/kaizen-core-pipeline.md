# KaiZen core pipeline

Single inbound path for Telegram text. No new features — routing and polish only.

## Flow

```
Telegram POST
  → netlify/functions/telegram-webhook.js
  → src/core/kaizenPipeline.js :: processWithHydration()
       hydrate Supabase → processIncomingMessage() → recordInteraction → persist
```

Inside `processIncomingMessage()`:

| Step | Branch | Module |
|------|--------|--------|
| 1 | Empty text | `getResponses(lang).pipelineEmptyText` |
| 2 | `/command` | `handlers/commands.js` :: `routeCommandMessage()` |
| 3 | Onboarding intercept | `handlers/onboarding.js` |
| 4 | Focus reply (plan flow) | `handlers/planTracking.js` |
| 5 | Natural text | `handlers/openConversation.js` |

Open text always:

```
classifyMessage()
  → prepareCompanionContext()     // companion/companionCore.js
  → compose body (handlers/brain)
  → packOpenReply()               // handlers/openReply.js
  → finalizeCompanionReply()      // companion/companionCore.js
```

## Key functions

| Concern | File | Function |
|---------|------|----------|
| **Main entry** | `netlify/functions/telegram-webhook.js` | `exports.handler` |
| **Orchestrator** | `src/core/kaizenPipeline.js` | `processWithHydration`, `processIncomingMessage` |
| **Command routing** | `src/handlers/commands.js` | `routeCommandMessage` |
| **Natural conversation** | `src/handlers/openConversation.js` | `handleOpenConversation` |
| **Reply finalize** | `src/companion/companionCore.js` | `prepareCompanionContext`, `finalizeCompanionReply` |
| **Language lock** | `src/i18n/languageDetect.js` | `resolveLanguageWithSession`, `resolveLang` |
| **Natural lang requests** | `src/i18n/languageLock.js` | `resolveNaturalLanguageRequest` (post-onboarding → `/language`) |
| **Anti-loop memory** | `src/companion/antiLoopEngine.js` | `applyAntiLoop` |
| **Structure memory** | `src/conversation/structureMemory.js` | `extractStructure`, `isStructureRepeat` |
| **Energy** | `src/handlers/energyHandler.js` | `handleEnergy` (commands), `buildEnergyFromOpenText` (open) |
| **Mode tone** | `src/companion/conversationModes.js` | `resolveConversationMode` |
| **Brain intents** | `src/brain/responseComposer.js` | `composeBrainPriority` |

## Rules enforced in code

1. **Language lock** — after onboarding, `resolveLanguageWithSession` / `resolveLang` use `preferredLanguage` only.
2. **Commands first** — slash text never enters open conversation.
3. **One next step** — `enforceSingleNextStep` strips duplicate `→ /cmd` lines; finalize adds at most one hint.
4. **Energy** — open energy intents and `energy_question` category use `buildEnergyFromOpenText` → `companion/energyEngine.js`.
5. **Command menus** — full lists only via `/guide` or `/map`; `/help` aliases `/guide`.
6. **Anti-loop** — `applyAntiLoop` + `structureMemory` on every finalized open reply.

## Stabilized commands

`/start` `/guide` `/map` `/today` `/morning` `/energy` `/reset` `/mirror` `/language` `/status`

Other commands remain in the switch but do not add parallel open-chat paths.

## Onboarding (first contact)

Short path in `companion/firstContactEngine.js`:

`/start` → intro → language (locked) → name → focus (1–6) → complete with `/today` hint.

`/guide` — daily usage (morning, today, energy, reset, mirror).  
`/map` — full command list only on request.

## Manual test checklist

1. `/start` — Elite Zone intro, no command dump  
2. Language `2` (Magyar) — lock HU  
3. `Stresszes reggelem van` — HU coaching, one next step, no EN  
4. `Mi a mai energia?` — compact energy block, optional `→ /energy`  
5. `/energy` — same energy engine as open  
6. `Magyarul kérem` (HU locked) — “Már magyarul…” not locale drift  
7. `/reset` — recovery copy  
8. `/mirror` — mirror ritual  
9. `/guide` — intentional command list  
10. Random casual line — short reply, no menu, no template loop  
