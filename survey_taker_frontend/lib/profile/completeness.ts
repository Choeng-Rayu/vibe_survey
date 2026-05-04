import { Profile } from '../validation/profileSchemas';

/**
 * Calculate profile completeness as a percentage.
 * Required fields: age, gender, interests.
 * Optional fields: firstName, lastName, location, education, employment, incomeRange.
 */
export function calculateCompleteness(profile: Partial<Profile>): number {
  const totalFields = 9; // 3 required + 6 optional
  let filled = 0;

  if (profile.age !== undefined) filled++;
  if (profile.gender !== undefined) filled++;
  if (profile.interests && Array.isArray(profile.interests)) filled++;

  if (profile.firstName !== undefined) filled++;
  if (profile.lastName !== undefined) filled++;
  if (profile.location !== undefined) filled++;
  if (profile.education !== undefined) filled++;
  if (profile.employment !== undefined) filled++;
  if (profile.incomeRange !== undefined) filled++;

  const percentage = Math.round((filled / totalFields) * 100);
  return percentage;
}
