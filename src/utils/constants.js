// src/utils/constants.js
const STAFF_CONSTANTS = {
  ALLOWED_ORDER_FIELDS: ['joining_date', 'name', 'status', 'code', 'created_at'],
  SEARCH_FIELDS: ['user_name', 'display_name', 'phone_number'],
  DEFAULT_PAGINATION: {
    PAGE: 1,
    LIMIT: 50,
    MAX_LIMIT: 100
  },
  STATUS_VALUES: {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  }
};

const USER_ATTRIBUTES = [
  'user_id', 'user_name', 'display_name', 'phone_number',
  'gender', 'religion', 'skills_and_proficiency', 'language_spoken',
  'education', 'date_of_birth', 'description', 'emailid',
  'profile_image', 'skill_type', 'zaper_skills', 'type'
];

const CLIENT_ATTRIBUTES = [
  'client_id', 'client_name', 'region', 'currency'
];

const ROLE_ATTRIBUTES = [
  'role_id', 'role_name', 'use_overtime', 'ot_above_hour',
  'regular_ot', 'holiday_pay_rate', 'sick_leave_eligibility',
  'annual_leave_eligibility', 'insurance_eligibility', 'air_ticket_eligibility'
];

const STAFF_ATTRIBUTES = [
  'staff_id', 'client_id', 'user_id', 'role_id', 'joining_date',
  'current_active', 'code', 'vendor_id', 'permissions',
  'project_permissions', 'created_at'
];

module.exports = {
  STAFF_CONSTANTS,
  USER_ATTRIBUTES,
  CLIENT_ATTRIBUTES,
  ROLE_ATTRIBUTES,
  STAFF_ATTRIBUTES
};
