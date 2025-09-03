// src/utils/constants.js
const STAFF_CONSTANTS = {
  ALLOWED_ORDER_FIELDS: ['joining_date', 'name', 'status', 'code', 'created_at'],
  
  // Enhanced searchable fields with detailed mapping
  SEARCHABLE_FIELDS: {
    // User table fields
    'name': 'display_name',
    'username': 'user_name', 
    'phone': 'phone_number',
    'email': 'emailid',
    'gender': 'gender',
    'religion': 'religion',
    'education': 'education',
    'skills': 'skills_and_proficiency',
    'language': 'language_spoken',
    'skill_type': 'skill_type',
    'user_type': 'type',
    
    // Staff table fields
    'code': 'code',
    'status': 'current_active'
  },
  
  // Fields that allow LIKE search (text fields)
  TEXT_SEARCHABLE_FIELDS: [
    'display_name', 'user_name', 'phone_number', 'emailid', 
    'gender', 'religion', 'education', 'skills_and_proficiency', 
    'language_spoken', 'skill_type', 'type', 'code'
  ],
  
  // Fields that require exact match (boolean, enum fields)
  EXACT_MATCH_FIELDS: ['current_active'],
  
  // Combinational filter options
  COMBINATIONAL_FILTERS: {
    // Overtime filter options
    OT_FILTERS: {
      ENABLED: 'enabled',
      DISABLED: 'disabled', 
      ALL: 'all'
    },
    
    // Face registration filter options
    FACE_FILTERS: {
      REGISTERED: 'registered',
      NOT_REGISTERED: 'not_registered',
      ALL: 'all'
    },
    
    // Device type filter options
    DEVICE_FILTERS: {
      ANDROID: 'android',
      IOS: 'ios',
      NO_DEVICE: 'none',
      ALL: 'all'
    },

    // Project count filter options
    PROJECT_FILTERS: {
      SINGLE: 'single',
      MULTI: 'multi',
      NONE: 'none',
      ALL: 'all'
    },
    
    // Predefined combined filter options
    COMBINED_FILTERS: {
      OT_WITH_FACE: 'ot_with_face',
      OT_WITHOUT_FACE: 'ot_without_face',
      NON_OT_WITH_FACE: 'non_ot_with_face', 
      NON_OT_WITHOUT_FACE: 'non_ot_without_face',
      ALL_OT: 'all_ot',
      ALL_NON_OT: 'all_non_ot',
      ALL_WITH_FACE: 'all_with_face',
      ALL_WITHOUT_FACE: 'all_without_face',
      ALL: 'all'
    }
  },
  
  // Salary filtration options
  SALARY_FILTERS: {
    FIELDS: ['take_home', 'basic_salary', 'ctc'],
    FIELD_MAPPING: {
      'take_home': 'take_home',
      'basic_salary': 'basic_salary',
      'ctc': 'ctc'
    },
    DEFAULT_CURRENCY: 'USD',
    SUPPORTED_CURRENCIES: ['USD', 'EUR', 'INR', 'GBP', 'CAD', 'AUD']
  },
  
  // NEW: Project-based filter options
  PROJECT_BASED_FILTERS: {
    ENABLED: true,
    VALIDATION_REQUIRED: true
  },
  
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
