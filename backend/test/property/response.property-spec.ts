import fc from 'fast-check';
import { JsonRoundTripParser, ResponsePayload } from './round-trip-parsers';

describe('Response parser properties', () => {
  it('round-trips valid response payloads', () => {
    fc.assert(
      fc.property(
        fc.record<ResponsePayload>({
          response_id: fc.uuid(),
          survey_id: fc.uuid(),
          user_id: fc.uuid(),
          timestamp: fc
            .integer({
              min: Date.parse('2020-01-01T00:00:00.000Z'),
              max: Date.parse('2035-01-01T00:00:00.000Z'),
            })
            .map((timestamp) => new Date(timestamp).toISOString()),
          answers: fc.dictionary(fc.string({ minLength: 1 }), fc.jsonValue()),
          behavioral_data: fc.dictionary(fc.string({ minLength: 1 }), fc.jsonValue()),
          quality_metrics: fc.dictionary(fc.string({ minLength: 1 }), fc.jsonValue()),
        }),
        (raw) => {
          const parsed = JsonRoundTripParser.parse(raw);
          const printed = JsonRoundTripParser.print(parsed);
          expect(JsonRoundTripParser.parse(JSON.parse(printed))).toEqual(parsed);
        },
      ),
    );
  });
});
