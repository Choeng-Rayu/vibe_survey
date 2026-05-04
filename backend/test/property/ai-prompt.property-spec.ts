import fc from 'fast-check';
import { AIPromptPayload, JsonRoundTripParser } from './round-trip-parsers';

describe('AI prompt parser properties', () => {
  it('round-trips valid AI prompt payloads', () => {
    fc.assert(
      fc.property(
        fc.record<AIPromptPayload>({
          prompt_id: fc.uuid(),
          user_id: fc.uuid(),
          agent_mode: fc.constantFrom('generate', 'modify', 'enhance', 'normalize', 'translate'),
          prompt_text: fc.string({ minLength: 1, maxLength: 500 }),
          conversation_context: fc.dictionary(fc.string({ minLength: 1 }), fc.jsonValue()),
        }),
        (raw) => {
          const parsed = JsonRoundTripParser.parse(raw);
          expect(JsonRoundTripParser.parse(JSON.parse(JsonRoundTripParser.print(parsed)))).toEqual(
            parsed,
          );
        },
      ),
    );
  });
});
