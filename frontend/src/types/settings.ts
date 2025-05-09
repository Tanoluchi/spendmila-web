import { UserPublic } from "@/client";

/**
 * Form data for settings page
 */
export interface SettingsFormData {
  firstName: string;
  lastName: string;
  email: string;
  default_currency_id: string | null;
  profile_picture?: string;
}

/**
 * Extended user type with additional fields
 */
export interface UserWithExtendedFields extends UserPublic {
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  full_name?: string;
}

/**
 * User update payload with proper typings
 */
export interface UserUpdatePayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  default_currency_id?: string | null;
  full_name?: string | null;
  profile_picture?: string;
}
