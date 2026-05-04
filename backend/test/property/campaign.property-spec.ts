import fc from 'fast-check';
import { CampaignPayload, JsonRoundTripParser } from './round-trip-parsers';

describe('Campaign parser properties', () => {
  it('round-trips valid campaign payloads', () => {
    fc.assert(
      fc.property(
        fc.record<CampaignPayload>({
          campaign_id: fc.uuid(),
          advertiser_id: fc.uuid(),
          survey_id: fc.uuid(),
          targeting_criteria: fc.dictionary(fc.string({ minLength: 1 }), fc.jsonValue()),
          budget_settings: fc.record({
            total_budget: fc.integer({ min: 1, max: 100000 }),
            cpr: fc.double({ min: 0.01, max: 100, noNaN: true }),
          }),
          lifecycle_status: fc.constantFrom('draft', 'pending_review', 'approved', 'active'),
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
