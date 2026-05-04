import fc from 'fast-check';
import { JsonRoundTripParser, TransactionPayload } from './round-trip-parsers';

describe('Payment parser properties', () => {
  it('round-trips valid transaction payloads', () => {
    fc.assert(
      fc.property(
        fc.record<TransactionPayload>({
          transaction_id: fc.uuid(),
          user_id: fc.uuid(),
          amount: fc.double({ min: 0.01, max: 100000, noNaN: true }),
          currency: fc.constantFrom('USD', 'KHR'),
          payment_method: fc.constantFrom('card', 'bank_transfer', 'mobile_wallet'),
          status: fc.constantFrom('pending', 'completed', 'failed', 'refunded'),
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
